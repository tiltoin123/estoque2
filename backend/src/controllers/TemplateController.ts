import { Request, Response } from "express";
import ShowTemplatesService from "../services/TemplateServices/ShowTemplatesService";
import ListTemplatesService from "../services/TemplateServices/ListTemplatesService";

export const show = async (req: Request, res: Response): Promise<Response> => {
    const { templateId } = req.params;

    try {
        const template = await ShowTemplatesService(Number(templateId));
        return res.status(200).json(template);
    } catch (error) {
        return res.status(404).json({ error: error });
    }
};

export const index = async (req: Request, res: Response): Promise<Response> => {
    try {
        const templates = await ListTemplatesService();
        return res.status(200).json(templates);
    } catch (error) {
        return res.status(404).json({ error: error });
    }
};
