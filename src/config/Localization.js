export const LANGS_AVAILABLE = ["EN"]

let LANG_CHOOSEN = localStorage.getItem("LANGUAGE") ?? LANGS_AVAILABLE[0]
export function getLangChoosen(){return LANG_CHOOSEN}
export function setLangChoosen(LANG,refresh=()=>{}){
    if(!(LANG_CHOOSEN in LANGS_AVAILABLE))return
    LANG_CHOOSEN = LANG
    localStorage.setItem("LANGUAGE", LANG)
    refresh()
}

async function getLangData(LANG) {
    return fetch('./assets/lang/lang_'+LANG+'.txt')
        .then((response)=>response.text())
        .then((text)=>{
            let lang = {}
            text.split('\n').forEach(line => {
                if(line!=""){
                lang[line.split(":")[0]] = line.slice(line.indexOf(":")+1, line.length)
                }
            });
            return lang        
        })
        .catch((e) => console.error(e));
  }

export async function getLanguages(){
    const entries = await Promise.all(
        LANGS_AVAILABLE.map(async (lang) => [lang, await getLangData(lang)])
    );
    return Object.fromEntries(entries);
}

let LANGUAGES = {};
export async function initLanguages() {
    LANGUAGES = await getLanguages();
}

/**Return the translation of a string id*/
export function getTranslation(STRING_ID) {
    if("")return STRING_ID;
    if(!(LANG_CHOOSEN in LANGUAGES)){return STRING_ID};
    const value = LANGUAGES[LANG_CHOOSEN];
    if(value === undefined || value === null)return STRING_ID;
    if(!(STRING_ID in value))return STRING_ID;
    return value[STRING_ID]
}