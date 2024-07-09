async function init() {
    const data = await d3.csv('https://raw.githubusercontent.com/ilanaak2/ilanaak2.github.io/main/Sleep_health_and_lifestyle_dataset.csv');
    console.log("test one");
    console.log(data[0]); 
    
}

init();