const {Router} = require('express')
const router = Router()
const Goods = require('../models/Goods')
const authcheck = require('../middleware/authcheck')
const Market = require("../models/Market");
const {S3} = require('aws-sdk');
const s3Upload =  async (file)=>{
    const s3 = new S3()
    const param ={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/image-${Date.now()}-${file.originalname}`,
        Body: file.buffer
    }
   return await s3.upload(param).promise()
}

const multer = require("multer");
const multerConfig = multer.memoryStorage()
const isImage = (req, file, callback)=>{
    if(file.mimetype.startsWith('image')){
        callback(null, true)
    }else{
        callback(new Error('Дозволено тільки зображення'))
    }
}

const upload = multer({
    storage: multerConfig,
    fileFilter: isImage,
})

// /api/goods/add
router.post('/add', authcheck,
    async (req, res) =>{
    try{
        if (!req.body.name) {
            return res.status(400).json({message: 'Заповніть всі поля!'})
        }
        const goods = new Goods({
            name: req.body.name, score: req.body.score, owner: req.body.ownerId, path: null, ownerName: req.body.ownerName
        })
        await goods.save(function(err, result){
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

// /api/goods/all
router.get('/all',authcheck, async(req, res) =>{
    try{
        const goods = await Goods.find({})
        res.json(goods)
    } catch (e){
        res.status(500).json({message: "Невдалося дістати дані"})
    }
})

// /api/goods/delete
router.post('/delete',authcheck, async (req, res) =>{
    try{
        await Goods.findOneAndDelete({ _id: req.body._id });
        res.json('ok')
    }catch (e){
        res.status(500).json({message: `Сталася помилка, спробуйте ще раз ${e}`})
    }
})

// /api/goods/set-data
router.post('/set-data', authcheck ,async (req, res) =>{
    try{
            let goods = await Goods.findOneAndUpdate({_id: req.body._id},
                {name: req.body.name, score: req.body.score, owner: req.body.ownerId, ownerName: req.body.ownerName})
            res.send(goods)
    }catch (e){
        res.status(500).json({message: e.message})
    }
})

// /api/goods/set-transit
router.post('/set-transit', authcheck ,async (req, res) =>{
    try{
        const MarketFromMass = await Market.find({_id: req.user.userId})
        const GoodsWillBeTransitMass = await Goods.find({_id: req.body.IdGoods})

        const MarketFrom = MarketFromMass[0]
        const MarketTo = JSON.parse(req.body.market)
        const GoodsWillBeTransit = GoodsWillBeTransitMass[0]
        const GoodsNumber = +req.body.score

        if(+GoodsWillBeTransit.score === GoodsNumber){
            const GoodsWillBeAddMass = await Goods.find({name: GoodsWillBeTransit.name, ownerName: MarketTo.name})
            if(GoodsWillBeAddMass.length > 0) {
                const GoodsWillBeAdd = GoodsWillBeAddMass[0]
                let newScore = Number(GoodsWillBeAdd.score) + Number(GoodsNumber)
                await Goods.findOneAndUpdate({_id: GoodsWillBeAdd._id},{score: newScore})
                await Goods.findOneAndDelete({_id: GoodsWillBeTransit._id})
                res.status(200).json({message: `Весь товар переміщений із магазину ${MarketFrom.name} до магазину ${MarketTo.name}`})
            }else {
                const goods = new Goods({
                    name: GoodsWillBeTransit.name, score: GoodsNumber, owner: MarketTo._id, path: GoodsWillBeTransit.path, ownerName: MarketTo.name
                })
                await goods.save(function (err) {
                    if (err) {
                        return res.status(500).json({message: err})
                    }
                })
                await Goods.findOneAndDelete({_id: GoodsWillBeTransit._id})
                res.status(200).json({message: `Весь товар переміщений із магазину ${MarketFrom.name} до магазину ${MarketTo.name}`})
            }
        }else {
            const GoodsWillBeAddMass = await Goods.find({name: GoodsWillBeTransit.name, ownerName: MarketTo.name})
            if(GoodsWillBeAddMass.length > 0) {
                const GoodsWillBeAdd = GoodsWillBeAddMass[0]
                let newScore = Number(GoodsWillBeAdd.score) + Number(GoodsNumber)
                await Goods.findOneAndUpdate({_id: GoodsWillBeAdd._id},{score: newScore})
                await Goods.findOneAndUpdate({_id: GoodsWillBeTransit._id},{score: +GoodsWillBeTransit.score - GoodsNumber})
                res.status(200).json({message: `${GoodsNumber} одиниць товару переміщено із магазину ${MarketFrom.name} до магазину ${MarketTo.name}`})
            }else {
                const goods = new Goods({
                    name: GoodsWillBeTransit.name, score: GoodsNumber, owner: MarketTo._id, path: GoodsWillBeTransit.path, ownerName: MarketTo.name
                })
                await goods.save(function (err) {
                    if (err) {
                        res.status(500).json({message: err})
                    }
                })
                await Goods.findOneAndUpdate({_id: GoodsWillBeTransit._id},{score: +GoodsWillBeTransit.score - GoodsNumber})
                res.status(200).json({message: `${GoodsNumber} одиниць товару переміщено із магазину ${MarketFrom.name} до магазину ${MarketTo.name}`})
            }
        }
    }catch (e){
        res.status(500).json({message: e.message})
    }
})


// /api/goods/market-goods
router.get('/market-goods', authcheck ,async (req, res) =>{
    try{
        let goods = await Goods.find({owner: req.user.userId})
        res.json(goods)
    }catch (e){
        res.status(500).json({message: e.message})
    }
})

// /api/goods/upload
router.post('/upload', upload.single('file') ,async (req, res) =>{
    try{
        const  result = await s3Upload(req.file)
        await Goods.findOneAndUpdate({_id: req.body.id},{path: result.Location })
        res.json({ message: "Successfully uploaded files" });
    }catch (e){
        res.status(500).json({message: e.message})
    }
})

module.exports = router