import React, { useState } from 'react';
import Item from './Item';
import { RxCross1 } from "react-icons/rx";
import { Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import styles from '../styles/ItemList.module.scss';

interface ItemListProps {
    sectionId: string;
    items: { id: string; name: string; price: string; series: string; society?: string; note?: number | string; value?: number | null }[];
    deleteItem: (sectionId: string, itemId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ sectionId, items, deleteItem }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [itemIdToDelete, setItemIdToDelete] = useState<string | null>(null);

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

    return (
        <>
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
