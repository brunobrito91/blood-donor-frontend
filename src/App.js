import bloodDonation from './bloodDonation.png';
import './App.css';
import 'antd/dist/antd.css';
import axios from 'axios';
import React, {Component} from 'react';
import {Button, Divider, Table, Upload, message} from "antd";
import UploadOutlined from "@ant-design/icons/es/icons/UploadOutlined";


class App extends Component {
    state = {
        selectedFile: null,
        uploading: false,
        donorResult: null
    };

    onFileChange = event => {
        this.setState({
            selectedFile: event.target.files[0],
            donorResult: null
        });
    };

    onFileUpload = () => {
        const { selectedFile } = this.state;

        const formData = new FormData();
        formData.append(
            "file",
            selectedFile,
            selectedFile.name
        );

        this.setState({
            uploading: true,
        });

        axios
            .post("http://localhost:8081/donor/batch", formData)
            .then((response) => {
                console.log('donorResult: ', response);
                this.setState({
                    selectedFile: null,
                    uploading: false,
                    donorResult: response.data
                });
                message.success('upload successfully.');
            }, (error) => {
                console.log(error);
                this.setState({
                    uploading: false,
                });
                message.error('upload failed.');
            });
    };

    fileData = () => {
        if (this.state.selectedFile) {
            console.log('content: ', this.state.selectedFile);
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        }
        if (this.state.donorResult) {
            const columns1 = [
                {
                    title: 'Estado',
                    dataIndex: 'estado',
                    key: 'name',
                },
                {
                    title: 'Numero de Candidatos',
                    dataIndex: 'numeroCandidatos',
                    key: 'numeroCandidatos',
                }
            ];

            var candidatosPorEstado = Object.entries(this.state.donorResult['candidatosPorEstado'])
                .map(value => ({"estado": value[0], "numeroCandidatos": value[1]}));

            const columns2 = [
                {
                    title: 'Tipo Sanguíneo',
                    dataIndex: 'tipoSanguineo',
                    key: 'tipoSanguineo',
                },
                {
                    title: 'Média de idade',
                    dataIndex: 'idadeMedia',
                    key: 'idadeMedia',
                }
            ];

            var idadePorTipoSanguineo = Object.entries(this.state.donorResult['idadePorTipoSanguineo'])
                .map(value => ({"tipoSanguineo": value[0], "idadeMedia": value[1]}));

            const columns3 = [
                {
                    title: 'Faixa Etária',
                    dataIndex: 'faixaEtaria',
                    key: 'faixaEtaria',
                },
                {
                    title: 'Média de IMC',
                    dataIndex: 'imcMedio',
                    key: 'imcMedio',
                }
            ];

            var imcMedioPorFaixaEtaria = Object.entries(this.state.donorResult['imcMedioPorFaixaEtaria'])
                .map(value => ({"faixaEtaria": value[0], "imcMedio": value[1]}));

            const columns4 = [
                {
                    title: 'Sexo',
                    dataIndex: 'sexo',
                    key: 'sexo',
                },
                {
                    title: '% Obesos',
                    dataIndex: 'porcentagemObesos',
                    key: 'porcentagemObesos',
                }
            ];

            var percentualObesos = Object.entries(this.state.donorResult['percentualObesos'])
                .map(value => ({"sexo": value[0], "porcentagemObesos": value[1]}));

            const columns5 = [
                {
                    title: 'Tipo Sanguíneo',
                    dataIndex: 'tipoSanguineo',
                    key: 'tipoSanguineo',
                },
                {
                    title: 'Número de Possíveis Doadores',
                    dataIndex: 'quantidadeDoadores',
                    key: 'quantidadeDoadores',
                }
            ];

            var quantidadeDoadoresParaReceptor = Object.entries(this.state.donorResult['quantidadeDoadoresParaReceptor'])
                .map(value => ({"tipoSanguineo": value[0], "quantidadeDoadores": value[1]}));

            return (
                <div>
                    <Table dataSource={candidatosPorEstado} columns={columns1}/>
                    <Divider/>
                    <Table dataSource={idadePorTipoSanguineo} columns={columns2}/>
                    <Divider/>
                    <Table dataSource={imcMedioPorFaixaEtaria} columns={columns3}/>
                    <Divider/>
                    <Table dataSource={percentualObesos} columns={columns4}/>
                    <Divider/>
                    <Table dataSource={quantidadeDoadoresParaReceptor} columns={columns5}/>
                </div>
            )
        } else {
            return (
                <div>
                    <br/>
                    <h4>No information!</h4>
                </div>
            );
        }
    };


    render() {
        console.log("render");
        const { uploading, selectedFile } = this.state;
        const props = {
            onRemove: file => {
                this.setState({selectedFile: null, donorResult: null});
                message.info("file removed");
                console.log("file removed");
            },
            beforeUpload: file => {
                this.setState({selectedFile: file});
                message.info("file selected");
                console.log("file selected");
                return false;
            },
            selectedFile,
        };
        return (
            <div className="App">
                <header className="App-header">
                    <img src={bloodDonation} className="App-logo" alt="logo"/>
                    <Divider/>
                    <div>
                        <div>
                            <Upload {...props}>
                                <Button icon={<UploadOutlined />}>Select File</Button>
                            </Upload>
                            <Button
                                type="primary"
                                onClick={this.onFileUpload}
                                disabled={selectedFile === null}
                                loading={uploading}

                            >
                                {uploading ? 'Uploading' : 'Start Upload'}
                            </Button>
                        </div>
                        <Divider/>
                        <div>
                            {this.fileData()}
                        </div>
                    </div>
                </header>
            </div>
        )
    };
}

export default App;
