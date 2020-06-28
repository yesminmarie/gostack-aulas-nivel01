//presets são conjuntos de configurações criadas por terceiros

//@babel/preset-env 
//vai converter o código de um javascript mais moderno
//para um JS mais antigo, porém baseado no ambiente da nossa aplicação

//@babel/preset-react 
//vai adicionar as funcionalidades do react nessa conversão
module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-react'
    ],
    plugins: [
        '@babel/plugin-transform-runtime'
    ]
};

