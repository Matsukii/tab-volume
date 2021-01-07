let slider = document.getElementById("slider")
let mutebtn = document.getElementById("no-sound")
let voltext = document.getElementById("cvol")



/**
 * @description get current volume and remove the listener after popup complete load
 * @param {Event} event document event coming from listener
 */
window.onload = function (){
    voltext.innerText = "--";
    getActiveTabVolume()
}

isMuted = false
tabId = null;


setMuted = (muted) => {
    isMuted = muted;
    mutebtn.style.border = isMuted ? "solid 1px red" : "";

}

getActiveTabVolume = () => {

    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        if(tab.length > 0){
            tab = tab[0];
            tabId = tab.id;
    
            chrome.runtime.sendMessage({name: 'get-tab-volume',  tabId}, vol =>{
                slider.value = vol.volume;
                voltext.innerText = (vol.volume * 100) || "--";

                setMuted(vol.mute)
                console.log(vol);
            })
        }
    })

}




slider.addEventListener('change', (el)=>{
    let newVol = parseFloat(window.event.target.value);

    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        if(tab.length > 0){
            tab = tab[0];
            let tabId = tab.id;

            console.log(`vol ${newVol} for tabId ${tabId}`);
            voltext.innerText = `${newVol * 100}%`;

            chrome.runtime.sendMessage({ name: 'set-tab-volume',  tabId, newVol, mute: false}, muted => {
                setMuted(muted)
            })
        }
    })

})


mutebtn.addEventListener("click", ()=>{

    chrome.tabs.query({ active: true, currentWindow: true }, tab => {
        if(tab.length > 0){
            tab = tab[0];
            tabId = tab.id;

            let newVol = parseFloat(slider.value)
            voltext.innerText = "muted";
            

            console.log(`vol ${newVol} for tabId ${tabId}`);

            chrome.runtime.sendMessage({ name: 'set-tab-volume',  tabId, newVol, mute: !isMuted}, muted => {
                setMuted(muted)
            })
        }
    })
})