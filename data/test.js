const test = require('ava');

const stopParser = require('./stop_parser');

const header = `
stop_id,stop_code,stop_name,stop_desc,stop_lat,stop_lon,location_type,parent_station,wheelchair_boarding
`.trim();

const invalidTestData = `
${header}
1,1,"Jackson & Austin Terminal","Jackson & Austin Terminal, Northeastbound, Bus Terminal",41.87632184,-87.77410482,0,,1
2,2,"5900 W Jackson","5900 W Jackson, Eastbound, Southside of the Street",41.87706679,-87.77131794,0,,1
3,3,"Jackson & Menard","Jackson & Menard, Eastbound, Southside of the Street",41.87695725,-87.76975039,0,,1
4,4,"5700 W Jackson","5700 W Jackson, Eastbound, Southside of the Street",41.87702418,-87.76745055,0,,1
6,6,"Jackson & Lotus","Jackson & Lotus, Eastbound, Southeast Corner",41.876513,-87.761446,0,,1
7,7,"5351 W Jackson","5351 W Jackson, Eastbound, Southside of the Street",41.87655197,-87.75892544,0,,1
8,8,"Jackson & Lockwood","Jackson & Lockwood, Eastbound, Southeast Corner",41.876564,-87.757313,0,,1
9,9,"Jackson & Laramie","Jackson & Laramie, Eastbound, Southeast Corner",41.87659463,-87.75461526,0,,1
10,10,"Jackson & Leamington","Jackson & Leamington, Eastbound, Southeast Corner",41.87662635,-87.7531684,0,,1
`.trim();

const validTestData = `
${header}
41010,,"Rockwell","",41.966115,-87.6941,1,,1
41020,,"Logan Square","",41.9295342259,-87.7076881549,1,,1
41030,,"Polk","",41.871551,-87.66953,1,,1
41040,,"Kedzie (Pink)","",41.853964,-87.705408,1,,0
41050,,"Linden","",42.073153,-87.69073,1,,1
41060,,"Ashland (Orange)","",41.839234,-87.665317,1,,1
41070,,"Kedzie (Green)","",41.884321,-87.706155,1,,0
41080,,"47th (Green)","",41.809209,-87.618826,1,,1
41090,,"Monroe (Red)","",41.880745,-87.627696,1,,0
41120,,"35th-Bronzeville-IIT","",41.831677,-87.625826,1,,1
`.trim();

const validData = [
  { id: '41010', name: 'Rockwell', wheelchair: true },
  { id: '41020', name: 'Logan Square', wheelchair: true },
  { id: '41030', name: 'Polk', wheelchair: true },
  { id: '41040', name: 'Kedzie (Pink)', wheelchair: false },
  { id: '41050', name: 'Linden', wheelchair: true },
  { id: '41060', name: 'Ashland (Orange)', wheelchair: true },
  { id: '41070', name: 'Kedzie (Green)', wheelchair: false },
  { id: '41080', name: '47th (Green)', wheelchair: true },
  { id: '41090', name: 'Monroe (Red)', wheelchair: false },
  { id: '41120', name: '35th-Bronzeville-IIT', wheelchair: true }
];

const testMixedData = `
${header}
41010,,"Rockwell","",41.966115,-87.6941,1,,1
2,2,"5900 W Jackson","5900 W Jackson, Eastbound, Southside of the Street",41.87706679,-87.77131794,0,,1
41020,,"Logan Square","",41.9295342259,-87.7076881549,1,,1
41030,,"Polk","",41.871551,-87.66953,1,,1
41040,,"Kedzie (Pink)","",41.853964,-87.705408,1,,0
8,8,"Jackson & Lockwood","Jackson & Lockwood, Eastbound, Southeast Corner",41.876564,-87.757313,0,,1
7,7,"5351 W Jackson","5351 W Jackson, Eastbound, Southside of the Street",41.87655197,-87.75892544,0,,1
41050,,"Linden","",42.073153,-87.69073,1,,1
4,4,"5700 W Jackson","5700 W Jackson, Eastbound, Southside of the Street",41.87702418,-87.76745055,0,,1
10,10,"Jackson & Leamington","Jackson & Leamington, Eastbound, Southeast Corner",41.87662635,-87.7531684,0,,1
`.trim();

const validMixedData = [
  { id: '41010', name: 'Rockwell', wheelchair: true },
  { id: '41020', name: 'Logan Square', wheelchair: true },
  { id: '41030', name: 'Polk', wheelchair: true },
  { id: '41040', name: 'Kedzie (Pink)', wheelchair: false },
  { id: '41050', name: 'Linden', wheelchair: true }
];

test('No valid data', t => {
  t.deepEqual(stopParser(invalidTestData), []);
});

test('Only valid data', t => {
  t.deepEqual(stopParser(validTestData), validData);
});

test('Mixed data', t => {
  t.deepEqual(stopParser(testMixedData), validMixedData);
});
