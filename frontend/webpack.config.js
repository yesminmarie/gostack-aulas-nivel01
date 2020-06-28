//sempre utilizar o path para evitar problemas com caminhos em diferentes sistemas operacionais
const path = require('path');
const { NamedModulesPlugin } = require('webpack');

//entry: index.js será o arquivo de entrada da aplicação, será o primeiro arquivo carregado pela aplicação
//output: qual arquivo será gerado depois de ser convertido, será o bundle.js
module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'bundle.js'
    },
    //propriedade para monitorar as alterações dos arquivos públicos
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
    },
    //regras para converter cada tipo de arquivo
    module: {
        rules: [
            {
                //expressão regular para pegar todos os arquivos que terminam com a extensão js
                //se um arquivo js estiver dentro da pasta node_modules, ele não vai passar pelo processo do babel
                //resumindo, fala para o webpack: toda vez que for precisar
                //de um rquivo js e esse arquivo não estiver na pasta node_modules,
                //converta-o utilizando babel
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ]
            },
            {
                test: /.*\.(gif|png|jpe?g)$/i,
                use: {
                    loader: 'file-loader',
                }
            }
        ]
    },
};
