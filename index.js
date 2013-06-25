var fs = require("fs");

function Compiler(html) {
    html = html || '';
    if (/\.(?=tpl|html)$/.test(html)) html = fs.readFileSync(html);
    var begin = '<%',
        end = '%>',
        ecp = function(str){
            return str.replace(/('|\\|\r?\n)/g, '\\$1');
        },
        str = "var __='',echo=function(s){__+=s};with(_$||{}){",
        blen = begin.length,
        elen = end.length,
        b = html.indexOf(begin),
        e,
        tmp;
        while(b != -1) {
            e = html.indexOf(end);
            if(e < b) break; //�������ٱ���
            str += "__+='" + ecp(html.substring(0, b)) + "';";
            tmp = html.substring(b+blen, e).trim();
            if( tmp.indexOf('=') === 0 ) { //ģ�����
                tmp = tmp.substring(1);
                str += "typeof(" + tmp + ")!='undefined'&&(__+=" + tmp + ");";
            } else { //js����
                str += tmp;
            }
            html = html.substring(e + elen);
            b = html.indexOf(begin);
        }
        str += "__+='" + ecp(html) + "'}return __";
        this.render = new Function("_$", str);
}

function tpl(html, data) {
    var me = new Compiler(html);
    return data ? me.render(data) : me;
};
    
module.exports = tpl;