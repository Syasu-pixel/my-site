import copy,importlib.util,tempfile,unittest
from pathlib import Path

spec=importlib.util.spec_from_file_location('checker',Path(__file__).with_name('check-rule-catalog.py'))
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup);self.root=Path(self.temp.name)
        self.files={'AGENTS.md','docs/topic.md','scripts/check-gate.py'}
        (self.root/'docs').mkdir();(self.root/'AGENTS.md').write_text('[topic](docs/topic.md)',encoding='utf-8');(self.root/'docs/topic.md').write_text('# Topic',encoding='utf-8')
        self.catalog={'documents':[{'path':p,'title':p,'category':'mandatory','when':'all tasks'} for p in sorted(self.files) if p.endswith('.md')],'supporting':[{'path':'scripts/check-gate.py','when':'gate changes','role':'implementation'}],'reference_exceptions':[]}
    def errors(self):return c.check(self.root,self.files,self.catalog)['errors']
    def test_valid(self):self.assertEqual(self.errors(),[])
    def test_new_document_any_folder(self):
        self.files.add('elsewhere/new.md');self.assertTrue(any('unregistered document' in e for e in self.errors()))
    def test_rename(self):
        self.files.remove('docs/topic.md');self.files.add('docs/moved.md');self.assertTrue(any('missing document' in e for e in self.errors()));self.assertTrue(any('broken/' in e for e in self.errors()))
    def test_duplicate(self):
        self.catalog['documents'].append(copy.deepcopy(self.catalog['documents'][0]));self.assertTrue(any('duplicate' in e for e in self.errors()))
    def test_no_condition(self):
        self.catalog['documents'][0]['when']='';self.assertTrue(any('invalid classification' in e for e in self.errors()))
    def test_local_link_relative_not_root(self):
        (self.root/'docs/topic.md').write_text('[wrong](AGENTS.md)',encoding='utf-8');self.assertTrue(any('broken/' in e for e in self.errors()))
    def test_root_code_path(self):
        (self.root/'docs/topic.md').write_text('Read `AGENTS.md`.',encoding='utf-8');self.assertEqual(self.errors(),[])
    def test_missing_support(self):
        self.files.remove('scripts/check-gate.py');self.assertTrue(any('missing supporting' in e for e in self.errors()))
    def test_unregistered_workflow(self):
        self.files.add('.github/workflows/new.yml');self.assertTrue(any('unregistered control' in e for e in self.errors()))
    def test_reference_definition(self):
        (self.root/'docs/topic.md').write_text('[missing][r]\n\n[r]: absent.md',encoding='utf-8');self.assertTrue(any('absent.md' in e for e in self.errors()))
    def test_ambiguous_shorthand(self):
        self.files|={'a/x.js','b/x.js'};(self.root/'docs/topic.md').write_text('`x.js`',encoding='utf-8');self.assertTrue(any('ambiguous' in e for e in self.errors()))
    def test_exact_exception(self):
        (self.root/'docs/topic.md').write_text('`missing.md`',encoding='utf-8');self.catalog['reference_exceptions']=[{'source':'docs/topic.md','raw':'missing.md','type':'historical','reason':'Recorded old file; not a current dependency.'}];r=c.check(self.root,self.files,self.catalog);self.assertEqual(r['errors'],[]);self.assertFalse(r['semanticReadingVerified']);self.assertEqual(len(r['knownExceptions']),1)
    def test_stale_exception(self):
        self.catalog['reference_exceptions']=[{'source':'docs/topic.md','raw':'gone.md','type':'historical','reason':'old'}];self.assertTrue(any('stale' in e for e in self.errors()))
    def test_manual_and_external_not_verified(self):
        (self.root/'docs/topic.md').write_text('`docs/reference-notes/{slug}.md` [web](https://example.org/docs) [anchor](#topic)',encoding='utf-8');r=c.check(self.root,self.files,self.catalog);self.assertEqual(r['errors'],[]);self.assertEqual(len(r['externalReferences']),1);self.assertEqual(len(r['manualReferences']),2);self.assertFalse(r['semanticReadingVerified'])
    def test_index_deterministic(self):
        a=c.render_index(self.catalog);self.assertEqual(a,c.render_index(self.catalog));self.assertIn('docs/topic.md',a)
    def test_registered_alias_target_checked(self):
        (self.root/'docs/topic.md').write_text('`short.js`',encoding='utf-8');self.catalog['reference_aliases']=[{'source':'docs/topic.md','raw':'short.js','target':'scripts/check-gate.py','reason':'verified context'}];self.assertEqual(self.errors(),[]);self.files.remove('scripts/check-gate.py');self.assertTrue(any('invalid reference alias' in e for e in self.errors()))
    def test_alias_cannot_hide_broken_markdown_link(self):
        (self.root/'docs/topic.md').write_text('[bad](short.js)',encoding='utf-8');self.catalog['reference_aliases']=[{'source':'docs/topic.md','raw':'short.js','target':'scripts/check-gate.py','reason':'verified context'}];self.assertTrue(any('broken/' in e for e in self.errors()));self.assertTrue(any('stale reference alias' in e for e in self.errors()))
    def test_stale_alias(self):
        self.catalog['reference_aliases']=[{'source':'docs/topic.md','raw':'removed.js','target':'scripts/check-gate.py','reason':'old'}];self.assertTrue(any('stale reference alias' in e for e in self.errors()))

if __name__=='__main__':unittest.main()
