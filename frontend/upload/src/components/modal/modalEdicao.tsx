import React, { useState } from 'react';

interface Item {
    id: number; // Adiciona o campo id
    code: string;
    description: string;
    quantity: number;
    price: number;
    total_price: number;
}

interface ModalEdicaoProps {
    isModalOpen: boolean;
    setIsModalOpen: (isModalOpen: boolean) => void;
    item: Item;
    onSave: (editedItem: Item | null) => Promise<void>;
    onDelete: (id: number) => Promise<void>; // Adicione onDelete ao tipo ModalEdicaoProps
}





const ModalEdicao: React.FC<ModalEdicaoProps> = ({ isModalOpen, setIsModalOpen, item, onSave, onDelete }) => {
    const [editedItem, setEditedItem] = useState<Item>(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await onSave(editedItem);
            setIsModalOpen(false); // Fecha o modal após a edição
        } catch (error) {
            console.error('Erro ao salvar edição:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // Chama a função para excluir o item passando o ID
            await onDelete(item.id); // Passa o ID do item para a função de exclusão
            setIsModalOpen(false); // Fecha o modal após a exclusão
        } catch (error) {
            console.error('Erro ao excluir item:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsModalOpen(false); // Fecha o modal após a edição
    };


    if (isModalOpen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg overflow-hidden shadow-xl w-80">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-4">
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código</label>
                            <input type="text" id="code" name="code" value={editedItem.code} onChange={handleChange} readOnly className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${isModalOpen ? 'text-black bg-gray-200' : 'text-gray-500 bg-gray-100'}`} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input type="text" id="description" name="description" value={editedItem.description} onChange={handleChange} readOnly={!isModalOpen} className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${isModalOpen ? 'text-black bg-white' : 'text-gray-500 bg-gray-100'}`} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
                            <input type="number" id="quantity" name="quantity" value={editedItem.quantity} onChange={handleChange} readOnly={!isModalOpen} className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${isModalOpen ? 'text-black bg-white' : 'text-gray-500 bg-gray-100'}`} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
                            <input type="number" id="price" name="price" value={editedItem.price} onChange={handleChange} readOnly={!isModalOpen} className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${isModalOpen ? 'text-black bg-white' : 'text-gray-500 bg-gray-100'}`} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="total_price" className="block text-sm font-medium text-gray-700">Preço Total</label>
                            <input type="number" id="total_price" name="total_price" value={editedItem.total_price} onChange={handleChange} readOnly className={`mt-1 p-2 block w-full border border-gray-300 rounded-md ${isModalOpen ? 'text-black bg-gray-300' : 'text-gray-500 bg-gray-100'}`} />
                        </div>
                        <div className="flex justify-end">
                            <button type="button" onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Editar</button>
                            <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Excluir</button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Fechar</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default ModalEdicao;
