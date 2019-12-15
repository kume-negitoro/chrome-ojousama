let count = 0

if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
      var flattend = [];
      (function flat(array, depth) {
        for (let el of array) {
          if (Array.isArray(el) && depth > 0) {
            flat(el, depth - 1); 
          } else {
            flattend.push(el);
          }
        }
      })(this, Math.floor(depth) || 1);
      return flattend;
    };
  }

const isMatchObject = (tester, obj) => {
    return Object.keys(tester).every(k => tester[k] === obj[k]);
};
const renyou = (token) => {
    if (token.conjugated_type === '五段・タ行') {
        const basic = token.basic_form;
        return (basic.slice(0, basic.length - 1) +
            String.fromCharCode(basic.slice(-1).charCodeAt(0) - 3));
    }
    if (token.conjugated_type === '五段・ラ行') {
        const basic = token.basic_form;
        if(basic == 'する') return 'し'
        return (basic.slice(0, basic.length - 1) +
            String.fromCharCode(basic.slice(-1).charCodeAt(0) - 1));
    }
    if (['五段・ワ行促音便', '五段・サ行', '五段・カ行促音便'].indexOf(token.conjugated_type) !== -1) {
        const basic = token.basic_form;
        return (basic.slice(0, basic.length - 1) +
            String.fromCharCode(basic.slice(-1).charCodeAt(0) - 2));
    }
    if (token.conjugated_type.indexOf('五段') !== -1) {
        const basic = token.basic_form;
        return (basic.slice(0, basic.length - 1) +
            String.fromCharCode(basic.slice(-1).charCodeAt(0) - 2));
    }
    if (token.conjugated_type.indexOf('一段') !== -1) {
        const basic = token.basic_form;
        return basic.slice(0, basic.length - 1);
    }
    if (token.conjugated_type.indexOf('サ変') !== -1) {
        console.log(token)
        return 'し';
    }
    if (token.conjugated_type === 'カ変・クル') {
        return 'き';
    }
    if (token.conjugated_type === 'カ変・来ル') {
        return '来';
    }
};

class TokenReplacer {
    constructor(tokenizer) {
        this.replacerPairs = [];
        this.tokenizer = tokenizer;
    }
    tokenize(text) {
        return this.tokenizer.tokenize(text);
    }
    textize(tokens) {
        console.log(tokens)
        return tokens.reduce((text, token) => text + token.surface_form, '');
    }
    register(feature, replacer) {
        this.replacerPairs.push([feature, replacer]);
        return this;
    }
    replaceToken(left, mid, right, terminate) {
        for (const [f, r] of this.replacerPairs) {
            if (isMatchObject(f, mid)) {
                return r(left, mid, right, terminate);
            }
        }
        return mid;
    }
    replacedTokens(tokens) {
        const newTokens = []
        let verbAppeared = false
        for(let i = 0; i < tokens.length; i++){
            let terminated = false;
            const terminate = () => { terminated = true; }
            if(tokens[i].pos === '動詞') verbAppeared = true
            const newToken = this.replaceToken(
                tokens[i - 1], tokens[i], tokens[i + 1], terminate
            )
            newTokens.push(newToken)
            if(terminated) break
        }
        return [newTokens.flat(), verbAppeared]
    }
    replace(text) {
        const [tokens, verbAppeared] = this.replacedTokens(this.tokenize(text))
        return [this.textize(tokens), verbAppeared];
    }
}

new Promise(resolve => {
        kuromoji
            .builder({ dicPath: chrome.extension.getURL('dict') })
            .build((err, tokenizer) => resolve([err, tokenizer]))
    })
    .then(([err, tokenizer]) => {
        if(err) throw err
        
        function Add_Button(){
            const elements = [...document.querySelectorAll('div[data-testid=tweet] div[role=group]:Not(.converted)')]
            elements.forEach(x => {
                x.className += ' converted'
                const e = document.createElement('dev')
                e.setAttribute('class', 'css-1dbjc4n r-1iusvr4 r-18u37iz r-16y2uox r-1h0z5md')
                e.setAttribute('id', 'Tweet' + count)
                e.innerHTML = '<div aria-haspopup="false" aria-label="お嬢様化" role="button" data-focusable="true" tabindex="0" class="css-18t94o4 css-1dbjc4n r-1777fci r-11cpok1 r-1ny4l3l r-bztko3 r-lrvibr" data-testid="convert">'
                            + '<div dir="ltr" class="css-901oao r-1awozwy r-1re7ezh r-6koalj r-1qd0xha r-a023e6 r-16dba41 r-1h0z5md r-ad9z0x r-bcqeeo r-o7ynqc r-clp7b1 r-3s2u2q r-qvutc0">'
                            + '<div class="css-1dbjc4n r-xoduu5">'
                            + '<div class="css-1dbjc4n r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg withSVG">'
                            + '</div>'
                            + '<svg viewBox="0 0 287 287" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi">'
                            + '<g>'
                            + '<path d="M231.74,220H74.26L48.94,121.08l10.82,7.16C82,143,100.33,147.57,114.2,141.9c15.58-6.38,27-26.18,33.91-58.85L153,60l4.89,23.08c6.92,32.67,18.33,52.47,33.91,58.85,13.87,5.67,32.18,1.08,54.44-13.66l10.82-7.16ZM82,210H224l17.14-66.95c-20.63,11.37-38.46,14.1-53.11,8.1-15.54-6.36-27.07-21.84-35-47.12-7.94,25.28-19.47,40.76-35,47.12-14.65,6-32.48,3.27-53.11-8.1Z" />'
                            + '<path d="M40.5,119A20.5,20.5,0,1,1,61,98.5,20.53,20.53,0,0,1,40.5,119Zm0-31A10.5,10.5,0,1,0,51,98.5,10.51,10.51,0,0,0,40.5,88Z" />'
                            + '<path d="M265.5,119A20.5,20.5,0,1,1,286,98.5,20.53,20.53,0,0,1,265.5,119Zm0-31A10.5,10.5,0,1,0,276,98.5,10.51,10.51,0,0,0,265.5,88Z" />'
                            + '<path d="M152.5,55A20.5,20.5,0,1,1,173,34.5,20.53,20.53,0,0,1,152.5,55Zm0-31A10.5,10.5,0,1,0,163,34.5,10.51,10.51,0,0,0,152.5,24Z" />'
                            + '</g>'
                            + '</svg>'
                            + '</div>'
                            + '</div>'
                            + '</div>'
                e.addEventListener('click', () => {
                    Convert_Text(e)
                    const svg = e.querySelector('svg:Not(.converted)')
                    if(svg != null){
                        const buf = svg.parentNode
                        buf.innerHTML = '<div class="css-1dbjc4n r-sdzlij r-1p0dtai r-xoduu5 r-1d2f490 r-xf4iuw r-u8s1d r-zchlnj r-ipm5af r-o7ynqc r-6416eg withSVG">'
                                    + '</div>'
                                    + '<svg viewBox="0 0 287 287" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi converted" style=color:rgb( 220, 220, 0 )>'
                                    + '<g>'
                                    + '<path d="M153,215h74.86L249,132.41c-52.93,35-82.83,13.82-96-48.32-13.17,62.14-43.07,83.36-96,48.32L78.14,215Z" />'
                                    + '<path d="M231.74,220H74.26L48.94,121.08l10.82,7.16C82,143,100.33,147.57,114.2,141.9c15.58-6.38,27-26.18,33.91-58.85L153,60l4.89,23.08c6.92,32.67,18.33,52.47,33.91,58.85,13.87,5.67,32.18,1.08,54.44-13.66l10.82-7.16ZM82,210H224l17.14-66.95c-20.63,11.37-38.46,14.1-53.11,8.1-15.54-6.36-27.07-21.84-35-47.12-7.94,25.28-19.47,40.76-35,47.12-14.65,6-32.48,3.27-53.11-8.1Z" />'
                                    //+ '<circle cx="20.5" cy="84.5" r="15.5"/>'
                                    + '<path d="M40.5,119A20.5,20.5,0,1,1,61,98.5,20.53,20.53,0,0,1,40.5,119Zm0-31A10.5,10.5,0,1,0,51,98.5,10.51,10.51,0,0,0,40.5,88Z" />'
                                    //+ '<circle cx="245.5" cy="84.5" r="15.5"/>'
                                    + '<path d="M265.5,119A20.5,20.5,0,1,1,286,98.5,20.53,20.53,0,0,1,265.5,119Zm0-31A10.5,10.5,0,1,0,276,98.5,10.51,10.51,0,0,0,265.5,88Z" />'
                                    //+ '<circle cx="132.5" cy="20.5" r="15.5"/>'
                                    + '<path d="M152.5,55A20.5,20.5,0,1,1,173,34.5,20.53,20.53,0,0,1,152.5,55Zm0-31A10.5,10.5,0,1,0,163,34.5,10.51,10.51,0,0,0,152.5,24Z" />'
                                    + '</g>'
                                    + '</svg>'
                    }
                })
                e.addEventListener('mouseenter', () => {
                    e.querySelector('svg').style.color = 'rgb( 220, 220, 0 )'
                    e.querySelector('.withSVG').style.backgroundColor = 'rgba( 220, 220, 0 , 0.1)'
                }, false);
                e.addEventListener('mouseleave', () => {
                    const buf = e.querySelector('svg:Not(.converted)')
                    if(buf != null){
                        buf.style.color = 'gray'
                    }
                    e.querySelector('.withSVG').style.backgroundColor = 'rgba( 0, 0, 0 , 0)'
                }, false);
                x.insertBefore(e, x.lastChild)
                x.parentNode.className += ' Tweet' + count
                count++
            })
            requestAnimationFrame(Add_Button)
        }
        
        function Convert_Text(button){
            const name = '.' + button.parentNode.parentNode.className.split(' ').pop()
            const tweetName = document.querySelector('div[data-testid=tweet]>div+div' + name + '>div>div>div>a>div>div>div>span>span:Not(.converted)')
            if(tweetName != null){
                tweetName.className += ' converted'
                tweetName.textContent += 'お嬢様'
            }
            const buf = document.querySelector('div[data-testid=tweet]>div+div' + name)
            const tweetIcon = buf.parentNode.querySelector('div>div>div>a>div>div+div>div>img:Not(.converted)')
            const tweetIconDiv = buf.parentNode.querySelector('div>div>div>a>div>div+div>div>div:Not(.converted)')
            if(tweetIcon != null){
                tweetIcon.className += ' converted'
                tweetIconDiv.className += ' converted'
                tweetIcon.setAttribute('src', chrome.extension.getURL('images/-RNNhhqF_400x400.jpg'))
                tweetIconDiv.style.backgroundImage = 'url(' + chrome.extension.getURL('images/-RNNhhqF_400x400.jpg') + ')'
            }
            
            
            const elements = [...document.querySelectorAll('div[data-testid=tweet]>div+div' + name + '>div+div>span:Not(.converted)')]
            elements.forEach(x => {
                x.className += ' converted'
                // x.textContent = x.textContent.replace('\n','ですわ！\n') + 'ですわ！'

                const replacer = new TokenReplacer(tokenizer)
                replacer
                    .register({
                        pos: '名詞',
                        pos_detail_1: '接尾',
                        pos_detail_2: '人名',
                    }, (left, mid, right) => {
                        return tokenizer.tokenize('さま')
                    })
                    .register({
                        pos: '名詞',
                        pos_detail_1: '接尾'
                    }, (left, mid, right) => {
                        return tokenizer.tokenize(
                            mid.surface_form
                                .replace(/さん|くん|ちゃん|君|様/, 'さま')
                        )
                    })
                    .register({
                        pos: '名詞',
                        pos_detail_1: '代名詞'
                    }, (left, mid, right) => {
                        return tokenizer.tokenize(
                            mid.surface_form
                                .replace(/私|僕|あたし|わたし|ぼく|拙者|俺|おれ/, 'わたくし')
                        )
                    })
                    .register({
                        pos: '感動詞'
                    }, (left, mid, right) => {
                        return tokenizer.tokenize(
                            mid.surface_form
                                .replace(/すいません|すみません/, '恐れ入ります')
                        )
                    })
                    .register({
                        pos: '名詞'
                    }, (left, mid, right) => {
                        return tokenizer.tokenize(
                            mid.surface_form
                                .replace(/父|お父さん|パパ|父親|父さん|父上/, 'お父さま')
                        )
                    })
                    .register({
                        pos: '動詞'
                    }, (left, mid, right, terminate) => {
                        terminate()
                        return [tokenizer.tokenize(renyou(tokenizer.tokenize(mid.basic_form)[0]))[0], ...tokenizer.tokenize('ますわ')]
                    })
                    .register({}, (left, mid, right) => {
                        if(!right) return [mid, ...tokenizer.tokenize('ですわ')]
                        return mid
                    })
                    
                 const [text, verbAppeared] = replacer.replace(x.textContent)
                 x.textContent = verbAppeared ? text : text + 'ですわ'
                
                // const tokens = []
                // let verbAppeared = false
                // for(const token of tokenizer.tokenize(x.textContent)){
                //     if(token.pos === '動詞'){
                //         tokens.push(
                //             [tokenizer.tokenize(renyou(tokenizer.tokenize(token.basic_form)[0]))[0], ...tokenizer.tokenize('ますわ')]
                //         )
                //         verbAppeared = true
                //         break
                //     }
                //     tokens.push(token)
                // }
                // if(!verbAppeared) tokens.push(...tokenizer.tokenize('ですわ'))

                // x.textContent = tokens.flat().reduce((text, token) => text + token.surface_form, '');
                
            })
        }
        
        requestAnimationFrame(Add_Button)
    })