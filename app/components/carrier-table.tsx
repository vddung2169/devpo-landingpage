"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CarrierTable() {
  const carriers = [
    // 🇺🇸 US
    {
      carrier: "US Reseller Flex Policy",
      imsi: "2040400",
      gid1: "3A00",
      gid2: "",
    },
    {
      carrier: "US Carrier - US Cellular",
      imsi: "3115801",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Tracfone | Straight Talk",
      imsi: "3102600",
      gid1: "534D",
      gid2: "",
    },
    { carrier: "AT&T US-GSM", imsi: "3104101", gid1: "", gid2: "" },
    { carrier: "Cricket", imsi: "3101508", gid1: "", gid2: "" },
    { carrier: "T-Mobile", imsi: "3102600", gid1: "", gid2: "" },
    { carrier: "MetroPCS", imsi: "3102400", gid1: "6D", gid2: "" },
    { carrier: "Ultra/Mint Mobile", imsi: "3102401", gid1: "4153", gid2: "" },
    { carrier: "US Visible", imsi: "3114801", gid1: "1A", gid2: "" },
    { carrier: "Sprint", imsi: "3101200", gid1: "A2", gid2: "" },
    { carrier: "Verizon", imsi: "2040400", gid1: "A3", gid2: "" },
    { carrier: "Xfinity - Xenon", imsi: "2040438", gid1: "", gid2: "" },
    { carrier: "Virgin", imsi: "3160101", gid1: "", gid2: "" },
    { carrier: "US Dish Boost", imsi: "3102401", gid1: "6432", gid2: "" },
    { carrier: "US RedPocket", imsi: "3104101", gid1: "42", gid2: "" },
    { carrier: "Japan Docomo", imsi: "4401020", gid1: "", gid2: "" },
    { carrier: "Japan Softbank", imsi: "4402081", gid1: "00", gid2: "" },
    { carrier: "Japan AU - KDDI", imsi: "4405081", gid1: "", gid2: "" },
    { carrier: "Japan Y!Mobile", imsi: "4402081", gid1: "16FFFF", gid2: "" },

    // 🇬🇧 UK
    { carrier: "UK Three", imsi: "2342091", gid1: "", gid2: "" },
    { carrier: "UK Vodafone", imsi: "2341590", gid1: "", gid2: "" },
    { carrier: "UK Orange", imsi: "2343343", gid1: "", gid2: "" },
    { carrier: "UK T-Mobile", imsi: "2343091", gid1: "", gid2: "" },
    { carrier: "UK 02", imsi: "2341091", gid1: "", gid2: "" },
    { carrier: "UK 02 Tesco", imsi: "2341022", gid1: "", gid2: "" },

    // 🇨🇦 Canada
    { carrier: "Roger", imsi: "3027204", gid1: "", gid2: "" },
    { carrier: "Bell", imsi: "3026103", gid1: "", gid2: "" },
    { carrier: "Telus", imsi: "3022200", gid1: "", gid2: "" },
    { carrier: "Fido", imsi: "3023703", gid1: "", gid2: "" },
    { carrier: "Sasktel", imsi: "3027800", gid1: "", gid2: "" },
    { carrier: "Freedom", imsi: "3024900", gid1: "", gid2: "" },
    { carrier: "Videotron", imsi: "3025001", gid1: "", gid2: "" },

    // 🇹🇭 Thailand
    { carrier: "ThaiLan True-H", imsi: "5200466", gid1: "", gid2: "" },
    { carrier: "ThaiLan AIS", imsi: "5200366", gid1: "", gid2: "" },

    // 🌏 Other regions
    { carrier: "Philippin Globe", imsi: "5150263", gid1: "", gid2: "" },
    { carrier: "China Telecom", imsi: "4601104", gid1: "", gid2: "" },
    { carrier: "Australia & NZ Service", imsi: "5050610", gid1: "", gid2: "" },
    { carrier: "Ireland Vodafone", imsi: "2720110", gid1: "", gid2: "" },
    { carrier: "Mexico Telcel", imsi: "3340252", gid1: "", gid2: "" },
  ];

  return (
    <section className="flex justify-center" id="carriers">
      <div className="container max-w-4xl px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">
          Danh sách mã IMSI nhà mạng iPhone Lock
        </h2>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Nhà mạng</TableHead>
                <TableHead className="text-center">IMSI</TableHead>
                <TableHead className="text-center">GID1</TableHead>
                <TableHead className="text-center">GID2</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriers.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{c.carrier}</TableCell>
                  <TableCell className="text-center">{c.imsi}</TableCell>
                  <TableCell className="text-center">{c.gid1}</TableCell>
                  <TableCell className="text-center">{c.gid2}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
