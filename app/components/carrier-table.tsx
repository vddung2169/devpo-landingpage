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
      imsi: "310120",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "AT&T US-GSM",
      imsi: "3104101",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "T-Mobile",
      imsi: "3102600 / 3102605",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Verizon",
      imsi: "2040438 / 311480",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Sprint",
      imsi: "310120",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Tracfone | Straight Talk",
      imsi: "310120 / 311480",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Xfinity",
      imsi: "2040438 / 311480",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "US Cellular",
      imsi: "3115801",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Cricket",
      imsi: "3101508",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "MetroPCS",
      imsi: "3102400",
      gid1: "6D",
      gid2: "",
    },

    // 🇯🇵 Japan
    {
      carrier: "Japan Softbank",
      imsi: "4402081",
      gid1: "00",
      gid2: "",
    },
    {
      carrier: "Japan Docomo",
      imsi: "4401020",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Japan AU - KDDI",
      imsi: "44050 / 44051",
      gid1: "",
      gid2: "",
    },

    // 🇬🇧 UK
    {
      carrier: "UK O2",
      imsi: "2341091",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "UK EE / Orange",
      imsi: "2343301",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "UK Vodafone",
      imsi: "2341590",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "UK Three",
      imsi: "2342091",
      gid1: "",
      gid2: "",
    },

    // 🇨🇦 Canada
    {
      carrier: "Canada Bell / Virgin",
      imsi: "3026101 / 302610",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Canada Rogers / Fido",
      imsi: "3027204 / 3023704",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Canada Telus / Koodo",
      imsi: "3022200 / 302220",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Canada Sasktel",
      imsi: "302780",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Canada Freedom",
      imsi: "302490",
      gid1: "",
      gid2: "",
    },

    // 🇰🇷 Korea
    {
      carrier: "Korea SK",
      imsi: "45005",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Korea KT",
      imsi: "45008",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Korea LG",
      imsi: "45006",
      gid1: "",
      gid2: "",
    },

    // 🇻🇳 Vietnam
    {
      carrier: "Viettel",
      imsi: "45204",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Vinaphone",
      imsi: "45202",
      gid1: "",
      gid2: "",
    },
    {
      carrier: "Mobifone",
      imsi: "45201",
      gid1: "",
      gid2: "",
    },
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
