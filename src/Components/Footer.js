export default function Footer(){
    return (
        <>
        <footer className="bg-white">
            <div className="container d-flex justify-content-between p-3">
                <div>
                    <h3>Partagez avec vos amis</h3>
                    <div className="d-flex justify-content-evenly">
                        <h3><a className="text-decoration-none fab fa-facebook-f d-inline-block"></a></h3>
                        <h3><a className="fab fa-instagram text-decoration-none d-inline-block"></a></h3>
                        <h3><a className="fab fa-linkedin text-decoration-none d-inline-block"></a></h3>
                        <h3><a className="fab fa-twitter"></a></h3>
                    </div>
                </div>
                <div>
                    <h3>Nos contacts</h3>
                    <h4>Tél:+212713158709</h4>
                    <h4>Email: issoufoos1234@gmail.com</h4>
                </div>
            </div>
        </footer>
        </>
    ) 
}