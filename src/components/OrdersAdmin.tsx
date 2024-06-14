import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Footer from "./Footer";
import HeaderAdmin from "./HeaderAdmin";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface OrderItem {
  id: string;
  picture: string;
  name: string;
  price: number;
  description: string;
  category: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: string;
  date: string;
  firstName: string;
  lastName: string;
  email: string;
  deliveryAddress: string;
  phoneNumber: string;
  check: boolean;
}

export function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Response is not JSON");
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchOrders();
  }, []);

  const handleCheckChange = async (orderId: string, checked: boolean) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ check: checked }),
    });

    if (response.ok) {
      setOrders((prevOrders) =>
        prevOrders
          .map((order) =>
            order.id === orderId ? { ...order, check: checked } : order
          )
          .sort((a, b) => Number(a.check) - Number(b.check))
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "validated") {
      return order.check;
    } else if (filter === "non-validated") {
      return !order.check;
    }
    return true;
  });

  const downloadExcel = () => {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, `orders_${Date.now()}.xlsx`);
  };

  const downloadCSV = () => {
    const csvData = XLSX.utils.json_to_sheet(filteredOrders);
    const csvBuffer = XLSX.utils.sheet_to_csv(csvData);
    const blob = new Blob([csvBuffer], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `orders_${Date.now()}.csv`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderAdmin />
      <div className="flex-grow px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Orders</h2>
          <Select onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filtrer les commandes</SelectLabel>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="validated">Validées</SelectItem>
                <SelectItem value="non-validated">Non-Validées</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={downloadExcel}>Download Excel</Button>
            <Button onClick={downloadCSV}>Download CSV</Button>
          </div>
        </div>
        <Table className="w-full">
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Nom et Prénom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adresse de livraison</TableHead>
              <TableHead>Contenu de la commande</TableHead>
              <TableHead>Payée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow
                key={order.id}
                className={order.check ? "bg-gray-500/80" : ""}
              >
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.name} - {item.quantity} x {item.price} €
                    </div>
                  ))}
                </TableCell>
                <TableCell className="">
                  <Checkbox
                    checked={order.check}
                    onCheckedChange={(checked) =>
                      handleCheckChange(order.id, checked as boolean)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Footer />
    </div>
  );
}
