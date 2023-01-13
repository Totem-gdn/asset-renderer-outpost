'use strict'
const { DNAParser, ContractHandler } = require('totem-dna-parser')
const totemCommonFiles = require('totem-common-files')
const maxValue = 4294967295;

class NFT {
  constructor() {
    this.ApiURL = process.env.API_URL;
    console.log('process.env.AVATAR_CONTRACT', process.env.AVATAR_CONTRACT[0]);
    this.Contracts = {
      avatar: process.env.AVATAR_CONTRACT,
      item: process.env.ITEM_CONTRACT,
      gem: process.env.GEM_CONTRACT
    }
  }
  async get (type, id) {
    try {
      let filterJson = type === 'avatar' ? totemCommonFiles.outpostsAvatarFilterJson : totemCommonFiles.outpostsItemFilterJson;
      const contractHandler = new ContractHandler(this.ApiURL, this.Contracts[type]);
      const dna = await contractHandler.getDNA(id);
      const parser = new DNAParser(filterJson, dna);
      const properties = parser.getFilterPropertiesList()
      let jsonProp = {...properties};
      let settings = {};
      for (const key in properties) {
        if (Object.hasOwnProperty.call(properties, key)) {
          settings[jsonProp[key]] = parser.getField(properties[key]);
        }
      }

      for (const key in settings) {
        if (Object.hasOwnProperty.call(settings, key) && key === 'range_nd') {
          settings.range_nd = Math.round((settings.range_nd / maxValue) * 100);
          settings.damage_nd = Math.round((settings.damage_nd / maxValue) * 100);
          if (settings.range_nd >= 50 && settings.damage_nd >= 50) {
            settings['weapon_type'] = 'Sniper';
          }

          if (settings.range_nd <= 50 && settings.damage_nd >= 50) {
            settings['weapon_type'] = 'Shotgun';
          }

          if (settings.range_nd >= 50 && settings.damage_nd <= 50) {
            settings['weapon_type'] = 'AssaultRifle';
          }

          if (settings.range_nd <= 50 && settings.damage_nd <= 50) {
            settings['weapon_type'] = 'Pistol';
          }
        }
      }

      return settings;
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new NFT()