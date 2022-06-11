const {Router} = require('express')
const router = Router()
const History = require('../models/History')
const authcheck = require('../middleware/authcheck')
const Market = require("../models/Market");

// /api/history/add
router.post('/add', authcheck,
    async (req, res) =>{
        try{
            const MarketFrom = await Market.find({_id: req.user.userId})
            const MarketTo = JSON.parse(req.body.marketTo)
            const history = new History(
                {
                    goodsName: req.body.nameGoods,
                    score: req.body.score,
                    fromMarket: MarketFrom[0].name,
                    toMarket: MarketTo.name,
                    dateTransit: Date.now()
                })
            history.save(function(err, result){
                if (err){
                    res.status(500).json({message: err})
                }
                else{
                    res.status(201).json({result})
                }
            })
        } catch (e){
            res.status(500).json({message: e.message})
        }
    })

// /api/history/admin
router.get('/admin', authcheck ,async (req, res) =>{
    try{
        let history = await History.find({})
        res.status(201).json(history)
    }catch (e){
        res.status(500).json({message: e.message})
    }
})

// /api/history/market
router.get('/market', authcheck ,async (req, res) =>{
    try{
        const MarketFrom = await Market.find({_id: req.user.userId})
        let history = await History.find({fromMarket: MarketFrom[0].name})
        res.status(201).json(history)
    }catch (e){
        res.status(500).json({message: e.message})
    }
})

module.exports = router