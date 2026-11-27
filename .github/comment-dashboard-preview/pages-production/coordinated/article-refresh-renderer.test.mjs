import assert from 'node:assert/strict';
import {mountArticleComments} from './article-client.mjs';
class Element {
 constructor(){this.children=[]; this.textContent=''; this.value=''; this.checked=false;}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 querySelector(s){return this.slots[s]}
 addEventListener(){}
 allText(){return this.textContent+this.children.map(c=>c.allText()).join(' ')}
}
const doc={createElement:()=>new Element()};
const node=()=>new Element();
const form=node(),root=node(), pub=node(),own=node(),text=node();
form.slots={'textarea':text,'input[name=nickname]':node(),'input[name=consent]':node(),'[type=submit]':node(),'[data-mode]':node(),'[data-cancel]':node()};
root.slots={'[data-public]':pub,'[data-pending]':own,'form':form,'[role=status]':node()};
const row={id:'synthetic',nickname:'合成名',body:'後で非表示にする合成コメント'};
const client={publicRows:async()=>[row],pendingRows:async()=>[]};
const ui=mountArticleComments({root,client,doc});
assert.equal(await ui.refresh(),true);
assert.match(pub.allText(),/後で非表示/);
text.value='残したい未送信の入力';
const empty={publicRows:async()=>[],pendingRows:async()=>[]};
assert.equal(await ui.refresh({source:empty}),true);
assert.doesNotMatch(pub.allText(),/後で非表示/);
assert.match(pub.allText(),/まだコメントはありません/);
assert.equal(text.value,'残したい未送信の入力');
assert.equal(await ui.refresh({allow:()=>false}),true);
assert.doesNotMatch(pub.allText(),/後で非表示/);
assert.equal(await ui.refresh({source:{...empty,publicRows:async()=>{throw Error('synthetic failure')}}}),false);
assert.match(pub.allText(),/読み込めません/);
assert.equal(text.value,'残したい未送信の入力');
console.log('Actual renderer: reload removes stale comments, late render suppressed, read failure returns false, draft stays');
