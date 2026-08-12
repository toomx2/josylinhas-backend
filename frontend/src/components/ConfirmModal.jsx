import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ConfirmModal = ({
    show,
    title = "Confirmar ação",
    message = "Tem certeza que deseja continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    confirmVariant = "danger",
    loading = false,
    onConfirm,
    onCancel
}) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton={!loading}>
                <Modal.Title>
                    {title}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {message}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary"
                        onClick={onCancel}
                        disabled={loading}>
                    {cancelText}
                </Button>

                <Button variant={confirmVariant}
                        onClick={onConfirm}
                        disabled={loading}>
                    {loading ? "Processando..." : confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmModal;