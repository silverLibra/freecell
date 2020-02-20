# 新接龍 | FreeCell <sub><sup>2020-02-20</sup></sub>

#### 頁面
[新接龍 | FreeCell](https://silverlibra.github.io/freecell/)
#### 遊戲介紹
移動紙牌的規則如下：<br/>
<ul>
    <li>將紙牌移動到某一欄時的順序必須為由大到小，而且是不同的顏色（即黑、紅兩種顏色）。</li>
    <li>將紙牌移至本位欄框時，必須以相同花色，將牌按照從低（A）到高（K）的順序移動。</li>
    <li>某欄最底端的紙牌可移到空白欄框、另一欄的最底端或本位欄框。</li>
    <li>空白欄框中的紙牌可移至某一欄的最底端或本位欄框。</li>
</ul>
<small>來源:<a href="https://zh.wikipedia.org/wiki/%E6%96%B0%E6%8E%A5%E9%BE%8D" target="_blank">新接龍 - 維基百科，自由的百科全書</a></small>

#### 使用的技術

使用React框架編寫新接龍遊戲，以及使用React的useReducer功能進行每個動作的狀態操作變更。<br/>
每張卡片使用Css - animation 的方式進行發牌的動畫，監聽發牌的動畫開始與結束。<br/>
並使用scss的for迴圈編輯產生每張卡片的animation Css<br/>
<a href="https://silverlibra.github.io/freecell/" target="_blank">使用網站</a> /
<a href="https://github.com/silverLibra/freecell/" target="_blank">GitHub</a><br/>
