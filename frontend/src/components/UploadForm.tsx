'use client'
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const UploadForm = () => {

    const handleFileChange = (info: any) => {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} Upload realizado com sucesso`);
            window.location.reload(); // Recarregar a página após o upload bem-sucedido
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} Erro ao processar arquivo.`);
        }

    };

    return (
        <div className="flex flex-col items-center justify-center mt-10" >
            <h2 className='text-xl font-bold mb-6 mt-10 flex justify-center items-center'>Upload CSV</h2>
            <Upload
                action="http://localhost:8080/api/upload" // Rota para o backend que processará o upload
                method="post" // Definindo method como 'post'
                headers={{
                    authorization: 'authorization-text',
                }}
                onChange={handleFileChange} // Manipulador de eventos onChange

            >
                <Button icon={<UploadOutlined />}>Selecione um arquivo</Button>
            </Upload>

        </div>

    );
};

export default UploadForm;
