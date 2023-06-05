import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "isomorphic-unfetch";

interface RegisterRequest extends NextApiRequest {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export default async function handler(
  req: RegisterRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    const response = await fetch("/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    let errormessage: string = 'An error occurred';
    return res.status(500).json({ success: false, error: errormessage });
  }
}