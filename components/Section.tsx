import React from 'react';
import ItemForm from './ItemForm';
import ItemList from './ItemList';
import { Item } from '../hooks/useSections';
import { RxCross1 } from "react-icons/rx";
import { Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import styles from '../styles/Section.module.scss';
import '../styles/globals.scss';

interface SectionProps {
    id: string;
    title: string;
    items: Item[];
    addItem: (sectionId: string, item: Item) => void;
    deleteSection: (sectionId: string) => void;
    deleteItem: (sectionId: string, itemId: string) => void;
}

const Section: React.FC<SectionProps> = ({ id, title, items, addItem, deleteSection, deleteItem }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleAddItem = (item: Item) => {
        addItem(id, item);
    };

    const handleDeleteSection = (onClose: () => void) => {
        deleteSection(id);
        onClose();
    };

    return (
        <Card className={styles.section}>
            <CardHeader>
                <h2>{title}</h2>
                <Tooltip content="Supprimer section">
                    <button onClick={onOpen} className={`deleteButton ${styles.deleteSection}`}><RxCross1 /></button>
                </Tooltip>
            </CardHeader>
            <CardBody>
                <ItemForm addItem={handleAddItem} sectionTitle={title} />
                <ItemList items={items} sectionId={id} deleteItem={deleteItem} />
            </CardBody>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmation de suppression</ModalHeader>
                            <ModalBody>
                                <p>Êtes-vous sûr de vouloir supprimer cette section ?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={() => handleDeleteSection(onClose)}>
                                    Confirmer
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default Section;
