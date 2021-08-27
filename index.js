const autoCompleteConfig = {
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchParam){
        const res = await axios.get('http://www.omdbapi.com/',{
            params:{
                apikey : 'thewdb',
                s : searchParam
            }
        })
        // if the api doesn't return us any movies so Error is returned
        if(res.data.Error){
            return [];
        }
        // returning the movies data array as a promise
        return res.data.Search;
    }
};

createAutoComplete({ 
    ...autoCompleteConfig,
    root : document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
createAutoComplete({ 
    ...autoCompleteConfig,
    root : document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});


let leftMovie, rightMovie;
const onMovieSelect = async (movie, summaryElement, side) =>{
    const response = await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey : 'thewdb',
            i : movie.imdbID
        }
    })
    
    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
        leftMovie = response.data;
    }else{
        rightMovie = response.data;
    }

    if(leftMovie && rightMovie){
        runComparison();
    }
}

const runComparison = () =>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification'),
        rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index)=>{
        const rightStat = rightSideStats[index];

        if(rightStat.dataset.value > leftStat.dataset.value){
            leftStat.classList.remove('is-info');
            leftStat.classList.add('is-warning');
        }else{
            rightStat.classList.remove('is-info');
            rightStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = movieDetail =>{
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')),
        metaScore = parseInt(movieDetail.Metascore),
        imdbRating = parseFloat(movieDetail.imdbRating),
        imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, '')),
        awards = movieDetail.Awards.split(' ').reduce((prev, word)=>{
            const value = parseInt(word);
            if(isNaN(value)){
                return prev;
            }
            else{
                return prev + value;
            }
        }, 0)

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        
        <article data-value=${awards} class="notification is-info">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-info">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-info">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-info">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-info">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}