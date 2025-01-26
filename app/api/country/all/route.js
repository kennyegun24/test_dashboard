// import connectMongoDb from "@/libs/mongodb";
// import countrySchema from "@/models/country_schema";
// import { NextResponse } from "next/server";

// // save country
// export const dynamic = "force-dynamic";

// export const GET = async (req, res) => {
//   try {
//     await connectMongoDb();
//     const allCountries = await countrySchema.find();

//     // Calculate the total count
//     const totalCount = allCountries.reduce(
//       (sum, country) => sum + country.count,
//       0
//     );

//     // Calculate the percentage for each country
//     const countriesWithPercentage = allCountries.map((country) => ({
//       country: country.country,
//       count: country.count,
//       country_code: country.country_code,
//       percentage: ((country.count / totalCount) * 100).toFixed(2), // Fix to 2 decimal places
//     }));

//     return NextResponse.json({ countriesWithPercentage });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error });
//   }
// };

export const GET = async () => {
  try {
    return NextResponse.json({ data: "countries" });
  } catch (error) {
    return NextResponse.json({ error });
  }
};
