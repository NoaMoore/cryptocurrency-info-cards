"use strict";

async function getAllCoins(){
    const result = await fetch('https://api.coingecko.com/api/v3/coins/list')
              const data = await result.json();
              return data;
    };


    async function getInfoCoins(id){
        const result = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
                  const data = await result.json();
                  return data;
        };