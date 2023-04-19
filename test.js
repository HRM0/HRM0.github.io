function makeDisplayNameFromId(id) {
    return `${id[0].toUpperCase()+ id.slice(1).toLowerCase()}`
  }

  const testStrings = [
    'input_string',
    'mr._coffee',
    'Mr._Coffee',
    '10_gallon_urn'
  ];
  const results = testStrings.map(element => makeDisplayNameFromId(element));
  
  console.log(results)