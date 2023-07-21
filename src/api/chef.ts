import { api } from "./index";
import { getAuthConfig } from "./utils";
import {
  Chef,
  type ChefInterface,
  ParsleyAPIResponse,
} from "../utils/customTypes";

export async function getChef(): Promise<ParsleyAPIResponse> {
  const authConfig = getAuthConfig();
  let response = new ParsleyAPIResponse();

  try {
    let chefData: ChefInterface = (await api.get(`chefs`, authConfig)).data
      .data;
    response.chef = new Chef(chefData);
    response.message = "Chef data grabbed successfully";
  } catch (err) {
    response.parseError(err);
  }

  return response;
}

export async function createChef(
  chefData: ChefInterface
): Promise<ParsleyAPIResponse> {
  let response = new ParsleyAPIResponse();
  try {
    const result = await api.post(`chefs`, chefData, getAuthConfig());
    response.chef = result.data.data;
    response.message = "Chef successfully created on the server";
  } catch (err) {
    response.parseError(err);
  }

  return response;
}
