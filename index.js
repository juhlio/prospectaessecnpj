const express = require('express');
const app = express();
const consultarCNPJ = require('consultar-cnpj')
const database = require('./db')
const prospectos = require('./prospectos')

const port = 3000;

const server = app.listen(port, function () {
    console.log('Servidor rodando na porta ' + port)
});



app.get('/', (req, res) => {

    // 200 status code means OK
    res.sendStatus(200)
    const token = '8K1JQXMjzgQzmmzleUd9oBWvsaCA1QrL5f6TjBtuSzMb';


    async function getConsumo() {
        const consumo = await consultarCNPJ.consumo(token)
        console.log(consumo)
    }

    /*  let ativ = req.query.segmento;
        let cityId = req.query.cidade;
        console.log(`Essa é a cidade => ${cityId} e esse é o segmento ${ativ}`) */


    async function getCNPJ() {
        await database.sync()

        const page = 1;
        //let ativ = "8112500";
        let ativ = req.query.segmento;
        //let cityId = 3547809;
        let cityId = req.query.cidade;
        console.log(`Essa é a cidade => ${cityId} e esse é o segmento ${ativ}`)

        try {
            const data = await consultarCNPJ.pesquisa(
                {
                    /*  atividade_principal_id: ativ, */
                    atividade_principal_id: '33.13-9-01',
                    //cidade_id: cityId
                },
                token,
                page
            );

            let totalPag = parseInt(data.paginacao.paginas)
            let pag = 2
            let companys = data.data
            companys.forEach(getDetails)

            console.log(data);
            console.log(`Total de paginas é => ${totalPag}`)
            console.log(`CNPJs => ${companys}`)

            while (pag <= totalPag) {

                let dados = await consultarCNPJ.pesquisa(
                    {
                        atividade_principal_id: '33.13-9-01',
                        //atividade_principal_id: ativ,
                        //cidade_id: cityId
                    },
                    token,
                    pag
                );
                console.log(dados);
                let companys = dados.data
                companys.forEach(getDetails)

                pag++
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async function getDetails(cnpj) {


        let empresa = await consultarCNPJ(cnpj, token)
        console.log(empresa)
        //let seg = req.query.seg;
        let seg = 'Manutençao Equipamentos';
        if (empresa.estabelecimento.complemento === null) {
            complemento = ""
            console.log('é null')
        } else {
            complemento = empresa.estabelecimento.complemento
            console.log('nao é null')
        }

        if (empresa.estabelecimento.ddd1 === null) {
            telefone1 = ""
            console.log('é null')
        } else {
            telefone1 = `${empresa.estabelecimento.ddd1} ${empresa.estabelecimento.telefone1}`
            console.log('nao é null')
        }

        if (empresa.estabelecimento.ddd2 === null) {
            telefone2 = ""
            console.log('é null')
        } else {
            telefone2 = `${empresa.estabelecimento.ddd2} ${empresa.estabelecimento.telefone2}`
            console.log('nao é null')
        }

        let endereco = `${empresa.estabelecimento.tipo_logradouro} ${empresa.estabelecimento.logradouro}`

        prospectos.create({
            razaoSocial: empresa.razao_social,
            cnpj: empresa.estabelecimento.cnpj,
            endereco: endereco,
            numero: empresa.estabelecimento.numero,
            complemento: complemento,
            bairro: empresa.estabelecimento.bairro,
            cep: empresa.estabelecimento.cep,
            cidade: empresa.estabelecimento.cidade.nome,
            uf: empresa.estabelecimento.estado.sigla,
            telefone1: telefone1,
            telefone2: telefone2,
            email: empresa.estabelecimento.email,
            segmento: seg,
        })
    }


    getCNPJ()

    //getConsumo()

})
