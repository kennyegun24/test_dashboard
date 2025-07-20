import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, service, subject, country_code, phone, desc } = body;

    const TRELLO_KEY = process.env.TRELLO_API_KEY;
    const TRELLO_TOKEN = process.env.TRELLO_API_TOKEN;
    const TRELLO_LIST_ID = process.env.TRELLO_LIST_ID;

    const trelloUrl = `https://api.trello.com/1/cards`;
    const parsedService = (() => {
      try {
        const s = JSON.parse(service);
        return Array.isArray(s) ? s.join(", ") : s;
      } catch {
        return service;
      }
    })();
    const params = {
      key: TRELLO_KEY,
      token: TRELLO_TOKEN,
      idList: TRELLO_LIST_ID,
      name: `Subject: ${subject}`,
      desc: `📥 **New Signup Request**

- **Name:** ${name}
- **Email:** ${email}
- **Phone:** ${phone}
- **Country Code:** ${country_code}
- **Service Selected:** ${parsedService}

📝 **Message:**  
${desc}
      `,
    };

    const response = await axios.post(trelloUrl, null, { params });

    return NextResponse.json(
      { success: true, card: response.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Trello API error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
