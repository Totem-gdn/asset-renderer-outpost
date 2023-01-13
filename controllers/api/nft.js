'use strict'
const nftHelper = require('../../helpers/dna-parser')

class NFTController {
  async get (req, res, next) {
    const { type, id } = req.params
    let { width = 500, height = 500 } = req.query
    if (!type || !id) {
      res.status(404).json({ error: 'Wrong format' })
    }
    const nft = await nftHelper.get(type, id);
    console.log(nft)
    if (nft && (type === 'avatar' || type === 'item')) {
      if (nft.primary_color) {
        nft.primaryShadow = nft.primary_color.replace(')', ', 0.5)').replace('rgb', 'rgba');
      }

        res.setHeader('Content-Type', 'image/svg+xml');
          res.render(`layouts/${type}`, {
            layout: `${type}.hbs`,
            ...nft,
            width: width,
            height: height,
          })
    } else {
      res.status(404).json({ error: 'File not found' })
      
    }
  }
}

module.exports = new NFTController()
