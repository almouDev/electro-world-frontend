import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function MyModal({show,onHide,confirmation}) {

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title><span className="text-danger">Attention !!!</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>Vous sûr de vouloir supprimer le produit</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" aria-label={"negative"} onClick={confirmation}>
                        Annuler
                    </Button>
                    <Button variant="primary" aria-label={"positive"} onClick={confirmation}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}