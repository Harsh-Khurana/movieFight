// debounce fn for adding delay
const debounce = (func, delay = 1000) =>{
    let timeoutId;
    return (...args)=>{
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            // apply fn basically spreads the arguments to the actual fn
            func.apply(null, args);
        }, delay);
    }
}