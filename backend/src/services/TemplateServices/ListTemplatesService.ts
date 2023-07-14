import Templates from "../../models/Template";
import AppError from "../../errors/AppError";

const ListTemplatesService = async (): Promise<Templates[]> => {
    const templates = await Templates.findAll({
        attributes: ["id", "message", "lastMessage", "nextMessage", "condition", "queueId"],
    });

    if (!templates) {
        throw new AppError("ERR_NO_TEMPLATES_FOUND", 404);
    }

    return templates;
};

export default ListTemplatesService;