from html.parser import HTMLParser
import re,html,hashlib

class Node:
 def __init__(self,tag,attrs,start,open_end,parent):
  self.tag=tag;self.attrs=dict(attrs);self.start=start;self.open_end=open_end;self.end=open_end;self.parent=parent;self.children=[]
 def has(self,cls):return cls in self.attrs.get('class','').split()
 def ancestor(self,fn):
  n=self.parent
  while n:
   if fn(n):return n
   n=n.parent
class Parser(HTMLParser):
 def __init__(self,s):
  super().__init__(convert_charrefs=False);self.s=s;self.nodes=[];self.stack=[];self.lines=[0]
  for m in re.finditer('\n',s):self.lines.append(m.end())
  self.feed(s)
 def pos(self):l,c=self.getpos();return self.lines[l-1]+c
 def handle_starttag(self,t,a):
  p=self.pos();n=Node(t,a,p,p+len(self.get_starttag_text()),self.stack[-1] if self.stack else None);self.nodes.append(n)
  if n.parent:n.parent.children.append(n)
  if t not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append(n)
 def handle_startendtag(self,t,a):self.handle_starttag(t,a);self.handle_endtag(t)
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i].tag==t:
    self.stack[i].end=self.s.find('>',self.pos())+1;self.stack=self.stack[:i];break
def text(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
def sha(s):return hashlib.sha256(s.encode()).hexdigest()

