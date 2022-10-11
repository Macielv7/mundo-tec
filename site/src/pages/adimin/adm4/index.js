import './index.scss';

import { ToastContainer, toast } from 'react-toastify';
import Menu from "../../../components/menu"
import storage from 'local-storage';
import { alterarProduto, cadastrarProduto, salvarImagens } from '../../../api/produtoAPI';
import { listarCategorias } from '../../../api/categoriaAPI';
import { listarDepartamentos } from '../../../api/departamentoAPI';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';




export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [valordesconto, setValorDesconto] = useState('');
    const [valorantigo, setValorAntigo] = useState('');
    const [id,setId] = useState (0)
  
    const [imagem, setImagem] = useState('');

    const [idDepartamento, setIdDepartamento] = useState('');
    const [departamentos, setDepartamentos] = useState([]);

    const [catSelecionadas, setCatSelecionadas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (!storage('adimin')) {
            navigate('/adm4')
        }
    }, [])

    async function carregarDepartamentos() {
        const r = await listarDepartamentos();
        setDepartamentos(r);
    }

    async function salvarClick(){
        try{ 
            if (!imagem){
                throw new Error('escolha a imagem do artista');
            }

            if(id === 0){
                const novoProduto = await cadastrarProduto (idDepartamento,nome,preco,valorantigo,valordesconto);
                await salvarImagens(novoProduto.id, imagem);
                setId(novoProduto.id)

                toast.dark('Novo artista cadastrado');
            }

            else{
                await alterarProduto(id,idDepartamento,nome,preco,valorantigo,valordesconto);
                if(typeof(imagem) == 'object'){
                    await salvarImagens(id, imagem)
                    
                }
                toast.dark(' Artista alterado com sucesso');
            }
            }

            
            
        catch (err){
                if(err.response)
                toast.error(err.response.data.erro)
                else
                toast.error(err.message);
            }
        }


   




    function escolherImagem() {
        document.getElementById('imagemCapa').click();
    }

    function exibirImagem(imagem){
        if(imagem == undefined){
            return 
        }
        else{
            return URL.createObjectURL(imagem)
        }
    }

    useEffect(() => {
        carregarDepartamentos();
    }, [])

    return (
        <main className='cont-main-cad'>
            
<Menu/>
            <section className='cont-section'>
                <ToastContainer/>
                
                <div className='cont-titulo-cadastro'>
                    
                    <h2 className='txt-produto'>
                        Cadastrar Produto
                    </h2>
                </div>

                <div className='cont-infos-cad'>
                    
                        <div className='form-colums'>
                            <div>
                                <div className='upload-capa' onClick={escolherImagem}>
                                    
                                    {!imagem &&
                                        <img src="/img/icons8-add-image-64.png" alt="" />
                                    }

                                    {imagem &&
                                        <img className='imagem-capa' src={exibirImagem(imagem)} onClick={() => escolherImagem ('imagem')}/>
                                    }

                                    <input type='file' id='imagemCapa' onChange={e => setImagem(e.target.files[0])} />
                                    
                                </div>

                            </div>

                            
                        <div className='contfilha1-infocad-001'>

                            <h2 className='text1-infocad001'>
                                Nome
                            </h2>
                            <input className='form-row' value={nome} onChange={e => setNome(e.target.value)} />
                            <h2 className='text2-infocad001'>
                                Preço
                            </h2>
                            <input className='form-row' value={preco} onChange={e => setPreco(e.target.value)} />
                        

                            <div className='cont-infocad-002'>
                        <div className='contfilha1-infocad-002'>

                            <label className='text2-infocad002'>Departamento:</label>
                            <select className='select-departamentos' value={idDepartamento} onChange={e => setIdDepartamento(e.target.value)}>
                                <option selected disabled hidden >Selecione um Departamento</option>
                                {departamentos.map(item =>
                                    <option value={item.id}> {item.departamento}</option>

                                )}

                            </select>
                           
                           

                        </div>
                        <div className='contfilha2-infocad-002'>
                            
                            <div className='cont5-contfilha2-infocad002'>
                                <h2 className='text1-c5-contfilha2-infocad002'>
                                    Valor do Desconto
                                </h2>
                                <input className='form-row' value={valordesconto} onChange={e => setValorDesconto(e.target.value)} />
                            </div>

                        </div>

                        <div className='contfilha2-infocad-002'>
                            
                            <div className='cont5-contfilha2-infocad002'>
                                <h2 className='text1-c5-contfilha2-infocad002'>
                                    Preco antigo
                                </h2>
                                <input className='form-row' value={valorantigo} onChange={e => setValorAntigo(e.target.value)} />
                            </div>

                        </div>
                      </div>

                    </div>
 
                    </div>
                   

                    <button className='btnSalvar' onClick={salvarClick} >
                        CADASTRAR
                    </button>
                </div>

            </section>

        </main>
    )
}