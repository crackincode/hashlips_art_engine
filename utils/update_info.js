const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require("fs");
const { getElements } = require("../src/main");
const layersDir = `${basePath}/layers`;

const {
  baseUri,
  description,
  namePrefix,
  network,
  solanaMetadata,
  layerConfigurations
} = require(`${basePath}/src/config.js`);

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);



const countOccurrence = ((attribute)=>{
  let rarityData = [];
  let editionSize = data.length;
  layerConfigurations.forEach((config) => {
    let layers = config.layersOrder;

    layers.forEach((layer)=>{
      let elementsForLayer = [];
      let elements = getElements(`${layersDir}/${layer.name}`)
      elements.forEach((element)=>{
        let rarityDataElement = {
          trait : element.name,
          weight : element.weight.toFixed(0),
          occurrence : 0
        }
        elementsForLayer.push(rarityDataElement);
      })
      let layerName = layer.options?.['displayName'] != undefined ? layer.options?.["displayName"] : layer.name;
      if (!rarityData.includes(layer.name)) {
        rarityData[layerName] = elementsForLayer
      }
    })
  })

  data.forEach((element)=>{
    let attributes = element.attributes;
    attributes.forEach((attribute)=>{
      let traitType = attribute.trait_type;
      let value = attribute.value;

      let rarityDataTrait = rarityData[traitType];
      rarityDataTrait.forEach((rarityDataTrait)=>{
        // console.log(rarityDataTrait)
        if (rarityDataTrait.trait === value) {
          rarityDataTrait.occurrence++;
        }
      })
    })
  })

  for (var layer in rarityData) {
    for (var attribute in rarityData[layer]) {
      // get chance
      let chance =
        ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);
  
      // show two decimal places in percent
      rarityData[layer][attribute].occurrence =
        `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
    }
  }

  for (var layer in rarityData) {
    // console.log(`Trait type: ${layer}`);
    console.log(attribute)
      if (layer === attribute.trait_type) {
        for(var trait in rarityData[layer]){
          console.log(attribute)
          if(trait === attribute.value){
            console.log("ATTRIBUTE", attribute)
          }
      }
    }
    console.log();
  }
  // console.log(rarityData)
  

})//end braces for function


data.forEach((item) => {
  // item.occurance = layerConfigurations
  // console.log()
  // countOccurrence(item.attributes)
  // for (var attribute in item.attributes) {
  //   console.log(item.attributes[attribute])
  //   countOccurrence(item.attributes[attribute])
  // }
  if (network == NETWORK.sol) {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = description;
    item.creators = solanaMetadata.creators;
  } else {
    item.name = `${namePrefix} #${item.edition}`;
    item.description = description;
    item.image = `${baseUri}/${item.edition}.png`;
  }
  fs.writeFileSync(
    `${basePath}/build/json/${item.edition}.json`,
    JSON.stringify(item, null, 2)
  );
});

fs.writeFileSync(
  `${basePath}/build/json/_metadata.json`,
  JSON.stringify(data, null, 2)
);

if (network == NETWORK.sol) {
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
  console.log(
    `Updated creators for images to ===> ${JSON.stringify(
      solanaMetadata.creators
    )}`
  );
} else {
  console.log(`Updated baseUri for images to ===> ${baseUri}`);
  console.log(`Updated description for images to ===> ${description}`);
  console.log(`Updated name prefix for images to ===> ${namePrefix}`);
}
