from pathlib import Path
p=Path('.github/scripts/temp_build_equipment_v2.py')
s=p.read_text(encoding='utf-8')
s=s.replace("main_start=s.index('<div class=\"main\">', s.index('<div class=\"layout\">'))","main_start=s.index('<main class=\"main\">', s.index('<div class=\"layout\">'))")
s=s.replace("main='''<div class=\"main\">","main='''<main class=\"main\"><article>")
s=s.replace("        </section>\n      </div>\n\n      '''","        </section>\n      </article></main>\n\n      '''")
p.write_text(s,encoding='utf-8')
print('patched build script')
