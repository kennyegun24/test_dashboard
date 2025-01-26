// import connectMongoDb from "@/libs/mongodb";
// import countrySchema from "@/models/country_schema";
import connectMongoDb from "@/lib/mongodb";
import Location from "@/models/Location";
import Visit from "@/models/Visits";
import { countries } from "@/utils/countries";
import { NextResponse } from "next/server";

// Save country
export const POST = async (req, res) => {
  const data = await req.json();
  const { lat, lng } = data;

  if (!lat || !lng) {
    return NextResponse.json(
      { error: "Lat and Lng points should be provided" },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    await connectMongoDb();
    const data = await response.json();
    console.log(data);
    const getCountry = countries.find(
      (e) => e.code.toLocaleLowerCase() === data?.address?.country_code
    );
    if (!getCountry) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    const continent = getCountry.continent;
    const countryCode = getCountry.code;
    const countryName = getCountry.name;
    if (!countryCode) {
      return NextResponse.json(
        { error: "Invalid country code" },
        { status: 400 }
      );
    }
    console.log(getCountry);
    let location = await Location.findOneAndUpdate(
      { continent: continent },
      { $setOnInsert: { continent } },
      { upsert: true, new: true }
    );

    const countryExists = location.countries.find(
      (e) => e.code === countryCode
    );

    if (countryExists) {
      await Location.updateOne(
        {
          continent,
          "countries.code": countryCode,
        },
        { $inc: { "countries.$.count": 1 } }
      );
    } else {
      await Location.updateOne(
        { continent },
        {
          $push: {
            countries: { name: countryName, code: countryCode, count: 1 },
          },
        }
      );
    }

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    let visitRecord = await Visit.findOne({ year, month });

    if (!visitRecord) {
      visitRecord = new Visit({
        year,
        month,
        totalVisits: 1,
      });
    } else {
      visitRecord.totalVisits += 1;
    }

    await visitRecord.save();

    return NextResponse.json({ data: location });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
};
