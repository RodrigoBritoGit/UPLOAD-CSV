'use client'
import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import ModalEdicao from '../components/modal/modalEdicao'; // Corrigir o caminho de importação e o nome do componente
import Modal from 'react-modal';

export default function Table() {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Defina o número de itens por página
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Adiciona estado para controlar a abertura do modal de edição

    useEffect(() => {
        fetchData();
    }, [currentPage]); // Atualize os dados quando a página atual mudar

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tabela?offset=${currentPage * itemsPerPage}&limit=${itemsPerPage}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados');
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    interface Item {
        id: number; // Adiciona o campo id
        code: string;
        description: string;
        quantity: number;
        price: number;
        total_price: number;
    }

    const handleEditClick = (item: Item) => {
        setSelectedItem(item);
        setIsEditModalOpen(true); // Abrir o modal de edição
    };

    const handleDeleteClick = async (id: number) => {
        try {
            // Implemente a lógica de exclusão aqui
            const response = await fetch(`http://localhost:8080/api/deletar/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Erro ao excluir o item');
            }
            // Atualiza os dados após a exclusão
            fetchData();
        } catch (error) {
            console.error('Erro ao excluir o item:', error);
        }
    };
    

  const handleDeleteItem = async () => {
    try {
        if (selectedItem) {
            // Chama a função para excluir o item passando o ID
            await handleDeleteClick(selectedItem.id); // Passa o ID do item para a função de exclusão
            setIsModalOpen(false); // Fecha o modal após a exclusão
        }
    } catch (error) {
        console.error('Erro ao excluir item:', error);
    }
};


    const handleEditSave = async (editedItem: Item | null) => {
        try {
            if (editedItem) {
                // Implemente a lógica de edição aqui
                const response = await fetch(`http://localhost:8080/api/editar/${editedItem.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editedItem)
                });
                if (!response.ok) {
                    throw new Error('Erro ao editar o item');
                }
                // Atualiza os dados após a edição
                fetchData();
            }
            setIsEditModalOpen(false); // Fecha o modal de edição
        } catch (error) {
            console.error('Erro ao editar o item:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Fechar o modal
        setIsEditModalOpen(false); // Fechar o modal de edição
    };

    const rows = data.map((item, index) => (
        <tr key={index}>
            <td className="border p-2 text-center">{item['code']}</td>
            <td className="border p-2 text-center">{item['description']}</td>
            <td className="border p-2 text-center">{item['quantity']}</td>
            <td className="border p-2 text-center">{item['price']}</td>
            <td className="border p-2 text-center">{item['total_price']}</td>
            <td className="border p-2 text-center">
                <button onClick={() => handleEditClick(item)}>Detalhes</button>
            </td>
        </tr>
    ));

    return (
        <div className="w-500 mx-auto">
            <h2 className="text-xl font-bold mb-6 mt-10 border p-2 flex justify-center items-center">Importações</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2">Código</th>
                        <th className="border p-2">Descrição</th>
                        <th className="border p-2">Quantidade</th>
                        <th className="border p-2">Preço</th>
                        <th className="border p-2">Preço Total</th>
                        <th className="border p-2">Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            {isModalOpen && selectedItem && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleCloseModal}
                >
                    <h2>Detalhes do Item</h2>
                    <p>Código: {selectedItem.code}</p>
                    <p>Descrição: {selectedItem.description}</p>
                    <p>Quantidade: {selectedItem.quantity}</p>
                    <p>Preço: {selectedItem.price}</p>
                    <p>Preço Total: {selectedItem.total_price}</p>
                    <button onClick={handleCloseModal}>Fechar</button>
                </Modal>
            )}
            {isEditModalOpen && selectedItem && (
               <ModalEdicao
               isModalOpen={isEditModalOpen}
               setIsModalOpen={setIsEditModalOpen}
               item={selectedItem}
               onSave={handleEditSave}
               onDelete={handleDeleteItem}
           />
            )}

            <div className="flex justify-center mt-4 p-4">
                <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Próximo'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={20} // Defina o número total de páginas
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination flex'}
                    activeClassName={'active'}
                    previousClassName={'pagination-arrow'}
                    nextClassName={'pagination-arrow'}
                    pageClassName={'pagination-page'}
                    pageLinkClassName={'pagination-link'}
                    previousLinkClassName={'pagination-link'}
                    nextLinkClassName={'pagination-link'}
                />
            </div>
        </div>
    );
}

