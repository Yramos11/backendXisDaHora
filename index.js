const express = require("express")
const app = express()

const Usuario = require("./models/Usuario")
const Hamburguer = require("./models/Hamburguer")
const Porcoes = require("./models/Porcoes")
const Sobremesas = require("./models/Sobremesas")
const Bebida = require("./models/Bebidas")

const bcrypt = require("bcryptjs")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const chaveSecreta = "chaveSegura"
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({

    destination: (req, file, cb) =>{
        
        cb(null, 'uploads/') // pasta onde as imagens vão ficar
    },
    filename: (req, file, cb) =>{
        const nomeUnico = Date.now() + '-' + file.originalname
        cb(null, nomeUnico)
    }
})

const upload = multer({ storage })

// Serve as imagens estáticas
app.use('/uploads', express.static('uploads'))

app.use(cors({

    credentials: true
}))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization

    if(!authHeader){

        return res.status(401).json({ message: "Token não fornecido" })
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token, chaveSecreta)
        req.user = decoded
        next()
    }catch(error){

        return res.status(401).json({ message: "Token inválido ou expirado" })
    }
}

const isAdmin = async (req, res, next) =>{

    try{

        const usuario = await Usuario.findByPk(req.user.id)

        if(!usuario || !usuario.admin){

            return res.status(403).json({ message: "Usuario não é administrador"})
        }

        next()
    }catch(error){

        return res.status(500).json({ message: "Erro ao verificar permissões de admin"})
    }
}

app.post("/auth/registrar", async (req, res) =>{

    const { nome, email, senha, telefone, cep, endereco, cidade } = req.body

    const usuarioExiste = await Usuario.findOne({ where: { email }})

    if(!usuarioExiste){

        try{

            const senhaHash = await bcrypt.hash(senha, 10)
    
            const novoUsuario = await Usuario.create({
        
                nome,
                email,
                senha: senhaHash,
                telefone,
                cep,
                cidade,
                endereco,
                admin: false
            })
    
            const token = jwt.sign(
    
                { 
                    id: novoUsuario.id, 
                    nome: novoUsuario.nome, 
                    email: novoUsuario.email,
                    telefone: novoUsuario.telefone, 
                    endereco: novoUsuario.endereco,  
                    cep: novoUsuario.cep,  
                    cidade: novoUsuario.cidade,
                    admin: novoUsuario.admin
                },
                chaveSecreta,
                { expiresIn: "1h" }
            )
    
            return res.status(200).json({
    
                message: "Registro feito com sucesso",
                user: {
                    id: novoUsuario.id, 
                    nome: novoUsuario.nome, 
                    email: novoUsuario.email,
                    telefone: novoUsuario.telefone, 
                    endereco: novoUsuario.endereco,  
                    cep: novoUsuario.cep,  
                    cidade: novoUsuario.cidade,
                    admin: novoUsuario.admin
                },
                token
            })
        }catch(error){
    
            res.send("Erro ao cadastrar usuario " + error)
        }
    }else{

        return res.status(400).json({ message: "Email ja existente" })
    }
})

app.post("/auth/login", async (req, res) =>{

    const { email, senha } = req.body

    const usuarioExiste = await Usuario.findOne({ where: { email }})

    if(usuarioExiste){

        const senhaCompativel = await bcrypt.compare(senha, usuarioExiste.senha)
      
        if(senhaCompativel){

            const token = jwt.sign(

                {
                    id: usuarioExiste.id, 
                    nome: usuarioExiste.nome, 
                    email: usuarioExiste.email, 
                    telefone: usuarioExiste.telefone, 
                    endereco: usuarioExiste.endereco,  
                    cep: usuarioExiste.cep,  
                    cidade: usuarioExiste.cidade,
                    admin: usuarioExiste.admin
                },
                chaveSecreta,
                { expiresIn: "1h" }
            )

            return res.status(200).json({

                message: "Login bem-sucedido!",
                user: {
                    id: usuarioExiste.id, 
                    nome: usuarioExiste.nome, 
                    email: usuarioExiste.email, 
                    telefone: usuarioExiste.telefone, 
                    endereco: usuarioExiste.endereco,  
                    cep: usuarioExiste.cep,  
                    cidade: usuarioExiste.cidade,
                    admin: usuarioExiste.admin
                },
                token
            })
        } else{

            res.status(400).json({ message: "Senha incorreta"})
        }
    } else{

        console.log("Usuario não existe registre-se")
    }
})

app.post("/admin/functions", authMiddleware, isAdmin, upload.single('imagem'), async (req, res) =>{

    const { nome, ingredientes, valor, categoria } = req.body
    const imagem = req.file ? req.file.filename : null

    console.log("passou aqui")

    if(categoria === "hamburguer"){

        const novoHamburguer = await Hamburguer.create({

            nome,
            ingredientes,
            valor,
            categoria,
            imagem
        })
    
        res.status(201).json(novoHamburguer)
    } else if(categoria === "porcoes"){

        const novoPorcao = await Porcoes.create({

            nome,
            ingredientes,
            valor,
            categoria,
            imagem
        })
    
        res.status(201).json(novoPorcao)
    } else if(categoria === "sobremesas"){

        const novaSobremesa = await Sobremesas.create({

            nome,
            ingredientes,
            valor,
            categoria,
            imagem
        })
    
        res.status(201).json(novaSobremesa)
    } else if(categoria === "bebidas"){

        const novaBebida = await Bebida.create({

            nome,
            valor,
            categoria,
            imagem
        })
    
        res.status(201).json(novaBebida)        
    } else{

        res.status(404).json({ message: "Não foi possivel escolher categoria"})
    }
})

app.get("/cardapio/:categoria", async (req, res) =>{

    const { categoria } = req.params

    try {
        
        if(categoria === "burgers"){

            const burguers = await Hamburguer.findAll()
            return res.status(200).json(burguers)

        }else if(categoria === "porcoes"){

            const porcoes = await Porcoes.findAll()
            return res.status(200).json(porcoes)

        }else if(categoria === "bebidas"){

            const bebidas = await Bebida.findAll()
            return res.status(200).json(bebidas)

        }else if(categoria === "sobremesas"){

            const sobremesas = await Sobremesas.findAll()
            return res.status(200).json(sobremesas)

        }else{

            return res.status(404).json({ message: "Categoria não encontrada" })
        }
    }catch(error){
        
        return res.status(500).send("Erro ao carregar cardápio " + error)
    }
})

app.get("/auth/validar-token", authMiddleware, async (req, res) => {

    try {
        const usuario = await Usuario.findByPk(req.user.id)

        if(!usuario){

            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        return res.status(200).json({

            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                cidade: usuario.cidade,
                cep: usuario.cep,
                endereco: usuario.endereco,
                admin: usuario.admin
            }
        })
    }catch(error){

        return res.status(500).json({ message: "Erro ao validar token" })
    }
})

app.listen(3001, () =>{

    console.log("Rodando")
})