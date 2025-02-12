try {
    if("alguma coisa") {
        throw new Error("Algo deu errado!")
    }
} catch(error) {
    console.error("Erro capturado:", error.message);
} finally {
    //alguma coisa obrigatória
}
