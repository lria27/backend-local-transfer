const {Router} = require('express')
const router = Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const Market = require('../models/Market')
const authcheck = require('../middleware/authcheck')


// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Неправельний email').isEmail(),
        check('password', 'Пароль має містити мінінмум 6 символів')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неправельна інформація при реєстрації'
                })
            }

            const {name, email, password, confirm} = req.body

            if(confirm !== password){
                return res.status(400).json({ message: 'Паролі не збігаються' })
            }

            const candidate = await Market.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'Цей користувач уже існує' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const market = new Market({name, email, password: hashedPassword })

            await market.save()

            const token = jwt.sign(
                {userId: market.id},
                process.env.JWT_SECRET,
                {expiresIn: '7h'}
            )
            res.json({ token, marketId: market.id, role: market.role })

        } catch (e) {
            res.status(500).json(e.message)
        }
    })

// /api/auth/data
router.get('/data', authcheck ,async (req, res) =>{
    try{
        const user = await Market.find({_id: req.user.userId})
        res.json(user)
    }catch (e){
        res.status(500).json({message: "Сталася помилка, спробуйте ще раз"})
    }
})


// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Неправельний email').isEmail(),
        check('password', 'Введіть пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Неправильна інформація для входу'
                })
            }

            const {email, password} = req.body
            const market = await Market.findOne({ email })

            if (!market) {
                return res.status(400).json({ message: 'Користувача не знайдено' })
            }

            const isMatch = await bcrypt.compare(password, market.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неправильний пароль, спробуйте ще раз' })
            }

            const token = jwt.sign(
                { userId: market.id },
                process.env.JWT_SECRET,
                { expiresIn: '7h' }
            )

            res.json({ token, marketId: market.id, role: market.role })

        } catch (e) {
            res.status(500).json({ message: 'Сталася помилка, спробуйте ще раз' })
        }
    })

// /api/auth/all
router.get('/all', authcheck ,async (req, res) =>{
    try{
        const user = await Market.find({role: 'Market'})
        res.json(user)
    }catch (e){
        res.status(500).json({message: "Сталася помилка, спробуйте ще раз"})
    }
})

module.exports = router