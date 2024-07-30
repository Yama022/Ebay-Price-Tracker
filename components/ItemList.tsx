import React, { useState } from 'react';
import Item from './Item';
import { RxCross1 } from "react-icons/rx";
import axios from 'axios';
import { Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Spinner } from "@nextui-org/react";
import styles from '../styles/ItemList.module.scss';
import '../styles/globals.scss';

interface ItemListProps {
    sectionId: string;
    items: { 
        id: string;
        name: string;
        number: string;
        price: string;
        series: string;
        society?: string;
        note?: number | string;
        value?: number | null
    }[];
    deleteItem: (sectionId: string, itemId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ sectionId, items, deleteItem }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);
    const [prices, setPrices] = useState<{ itemId: string; prices: any[] }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteItem = () => {
        if (itemIdToDelete) {
            deleteItem(sectionId, itemIdToDelete);
            setItemIdToDelete(null);
            onOpenChange();
        }
    };

    const openDeleteModal = (itemId: string) => {
        setItemIdToDelete(itemId);
        onOpen();
    };

    const handleCheckPrice = async () => {
        if (items.length > 0) {
            setIsLoading(true);
            const pricesList = [];
            for (const item of items) {
                try {
                    const response = await axios.post('http://localhost:5000/search_ebay', {
                        name: item.name,
                        number: item.number,
                        society: item.society,
                        note: item.note,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });
                    const filteredPrices = response.data.filter((price: any) => price.price.includes('EUR'));
                    pricesList.push({
                        itemId: item.id,
                        prices: filteredPrices
                    });
                } catch (error) {
                    console.error(`Erreur lors de la recherche sur eBay pour l'article ${item.name} :`, error);
                }
            }
            setPrices(pricesList);
            console.log(pricesList);
            setIsLoading(false);
        }
    };
    

    return (
        <>
            <div className={isLoading ? styles.blurred : ''}> {/* Appliquer le filtre flou */}
                <ul className={styles.itemList}>
                    {items.map((item, index) => (
                        <li key={index} className={styles.itemList__list}>
                            <Item item={item} />
                            <Tooltip content="Supprimer item">
                                <button onClick={() => openDeleteModal(item.id)} className='deleteButton'><RxCross1 /></button>
                            </Tooltip>
                        </li>
                    ))}
                </ul>

                {items.length > 0 && (
                    <div className={styles.itemList__checkPrice}>
                        <Button size='lg' color="primary" onClick={handleCheckPrice}>
                            Lancer la recherche de prix
                        </Button>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className={styles.spinnerContainer}>
                    <Spinner size='lg' color="primary" />
                </div>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">Confirmation de suppression</ModalHeader>
                        <ModalBody>
                            <p>Êtes-vous sûr de vouloir supprimer cet item ?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={() => onOpenChange()}>
                                Annuler
                            </Button>
                            <Button color="primary" onPress={handleDeleteItem}>
                                Confirmer
                            </Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ItemList;
