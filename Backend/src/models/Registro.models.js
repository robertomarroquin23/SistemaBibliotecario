import mongoose from "mongoose";

const generarCodigoPrestamo = () => {
    const longitud = 15;
    let codigo = '';
    for (let i = 0; i < longitud; i++) {
        codigo += Math.floor(Math.random() * 10).toString();
    }
    return codigo;
};

const registroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    libroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "books",
        required: true,
    },
    fechaPrestamo: {
        type: Date,
        default: Date.now,
        required: true,
    },
    fechaDevolucion: {
        type: Date,
        required: true,
    },
    estado: {
        type: String,
        enum: ["Prestado", "Devuelto"],
        default: "Prestado",
    },
    codigoPrestamo: {
        type: String,
        unique: true,
        default: generarCodigoPrestamo, 
    },
    idAlumno: {
        type: String,
        required: true,
    },
});

registroSchema.pre('save', async function (next) {
    let codigoExistente = await Registro.findOne({ codigoPrestamo: this.codigoPrestamo });
    while (codigoExistente) {
        this.codigoPrestamo = generarCodigoPrestamo();
        codigoExistente = await Registro.findOne({ codigoPrestamo: this.codigoPrestamo });
    }
    next();
});

const Registro = mongoose.model("registro", registroSchema);

export default Registro;
