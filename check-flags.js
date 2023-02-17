const { readdirSync, readFileSync } = require('node:fs')

const dirFlags = readdirSync('public/flags').map(filename => filename.slice(0, -4)).map(f => f.toUpperCase())
const countryDataFlags = JSON.parse(readFileSync('src/data/country_data.json')).features.map(({ properties }) => properties.FLAG)

for (const cdFlag of countryDataFlags) {
  const i = dirFlags.includes(cdFlag)

  if (!i) console.log(cdFlag)
}
