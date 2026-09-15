// =============================================================================
// Dữ liệu hướng dẫn fix lỗi sim trên iPhone Lock — dùng chung cho:
//  - Trình chẩn đoán tương tác (app/fix-loi/fix-guide.tsx)
//  - Phần nội dung đầy đủ render sẵn cho SEO + schema HowTo (app/fix-loi/page.tsx)
// Tách riêng thành file .ts (không JSX) để cả server lẫn client component đều dùng được.
// =============================================================================

/** Một bước xử lý. `warning` = cảnh báo/kết luận cần thay linh kiện. */
export interface FixStep {
  /** Nội dung thao tác, viết theo đúng lời khách hàng làm được ngay */
  text: string;
  /** Ghi chú phụ hiện nhỏ bên dưới (mẹo, lưu ý dễ sai) */
  note?: string;
  /** true → bước kết luận phần cứng, hiển thị dạng cảnh báo thay vì bước thường */
  warning?: boolean;
}

export interface Symptom {
  id: string;
  /** Dòng chữ máy báo, ví dụ: Không dịch vụ */
  label: string;
  /** Các cách máy có thể hiển thị lỗi này (tiếng Việt / tiếng Anh) */
  aliases: string[];
  /** Mô tả ngắn giúp khách nhận ra đúng lỗi của mình */
  hint: string;
  steps: FixStep[];
}

export interface DeviceType {
  id: string;
  /** Tên hiển thị trên thẻ chọn */
  label: string;
  /** Nhãn ngắn dùng cho breadcrumb của trình chẩn đoán */
  short: string;
  /** Mô tả để khách tự nhận ra máy mình thuộc loại nào */
  desc: string;
  /** Khoá icon, map sang lucide-react trong component client */
  icon: "sim" | "cpu" | "wifi";
  symptoms: Symptom[];
}

// Các bước lặp lại ở nhiều nhánh — khai báo một lần cho thống nhất câu chữ
const RESET_NETWORK: FixStep = {
  text: "Cài đặt → Cài đặt chung → Đặt lại → Đặt lại cài đặt mạng",
  note: "Máy sẽ khởi động lại và quên hết Wi-Fi đã lưu, không mất dữ liệu.",
};

const RESTART_DEVICE: FixStep = { text: "Tắt nguồn máy rồi mở lại" };

const AIRPLANE_MODE: FixStep = {
  text: "Bật rồi tắt chế độ máy bay",
  note: "Chờ khoảng 10 giây ở chế độ máy bay trước khi tắt đi.",
};

const SELECT_CARRIER: FixStep = {
  text: 'Cài đặt → Di động → Lựa chọn mạng → Tắt "Tự động" → Chờ hiện danh sách nhà mạng rồi chọn đúng nhà mạng của sim đang dùng',
  note: "Danh sách có thể mất 30–60 giây mới hiện, đừng thoát ra sớm.",
};

export const deviceTypes: DeviceType[] = [
  {
    id: "sim-ghep",
    label: "Máy dùng sim ghép",
    short: "Sim ghép",
    desc: "Phải lắp kèm sim ghép (thẻ mỏng đi cùng sim) thì máy mới lên sóng.",
    icon: "sim",
    symptoms: [
      {
        id: "khong-dich-vu",
        label: "Không dịch vụ",
        aliases: ["Không dịch vụ", "No Service", "Đang tìm kiếm"],
        hint: "Máy vẫn nhận sim nhưng góc trên không có vạch sóng, không gọi được.",
        steps: [
          {
            text: "Vào Cài đặt → Di động → Ứng dụng của sim ghép → Bấm Restart/Refresh 1 lần rồi đợi máy lên sóng",
            note: "Tên nút tuỳ loại sim ghép. Có thể làm lại 2–3 lần nhưng KHÔNG bấm quá nhanh, phải đợi lần trước chạy xong.",
          },
          RESTART_DEVICE,
          AIRPLANE_MODE,
          RESET_NETWORK,
          SELECT_CARRIER,
        ],
      },
      {
        id: "khong-co-sim",
        label: "Không có sim / Sim không hợp lệ",
        aliases: ["Không có sim", "Sim không hợp lệ", "No SIM", "Invalid SIM"],
        hint: "Máy không nhận được thẻ sim, thường do tiếp xúc giữa sim và sim ghép.",
        steps: [
          {
            text: "Tháo khay sim ra lắp lại",
            note: "Lắp lại cho phẳng, sim ghép và sim phải áp sát, không lệch mép.",
          },
          RESET_NETWORK,
          {
            text: "Chỉ lắp sim KHÔNG kèm sim ghép để xác định lỗi nằm ở đâu",
            note: "Nếu máy vẫn nhận sim, văng ra màn hình active và lên sóng đầy đủ → lỗi nằm ở sim ghép.",
          },
          {
            text: "Nếu đúng là lỗi sim ghép → thay sim ghép mới",
            warning: true,
          },
        ],
      },
    ],
  },
  {
    id: "cnc-eid",
    label: "Máy độ CNC EID",
    short: "Độ CNC EID",
    desc: "Dùng sim vật lý bình thường, không cần lắp kèm sim ghép.",
    icon: "cpu",
    symptoms: [
      {
        id: "khong-co-sim",
        label: "Không có sim / Sim không hợp lệ",
        aliases: ["Không có sim", "Sim không hợp lệ", "No SIM", "Invalid SIM"],
        hint: "Máy báo không có sim dù đã lắp sim vào khay.",
        steps: [
          {
            text: "Vào Cài đặt → Di động → Kiểm tra xem có sim nào đang tắt thì bật lên",
            note: "Nhiều máy không tự hiện sim từ đầu. Có thể bật/tắt chế độ máy bay để máy nhận sim.",
          },
          { text: "Tháo khay sim ra lắp lại" },
          RESET_NETWORK,
          {
            text: "Nếu vẫn không được → thay phôi sim khác. Vẫn không được nữa thì lỗi ổ sim, cần thay ổ sim mới",
            warning: true,
          },
        ],
      },
      {
        id: "khong-dich-vu",
        label: "Không dịch vụ",
        aliases: ["Không dịch vụ", "No Service", "Đang tìm kiếm"],
        hint: "Máy nhận sim nhưng không bắt được sóng nhà mạng.",
        steps: [
          {
            text: "Vào Cài đặt → Di động → Ứng dụng của sim → Bấm Restart/Refresh 1 lần",
            note: "Đây cũng là cách fix lỗi không có thông báo và lỗi không xoay ngang màn hình.",
          },
          RESTART_DEVICE,
          AIRPLANE_MODE,
          RESET_NETWORK,
          SELECT_CARRIER,
          {
            text: "Nếu vẫn không được → thay phôi sim khác. Vẫn không được nữa thì lỗi ổ sim, cần thay ổ sim mới",
            warning: true,
          },
        ],
      },
    ],
  },
  {
    id: "esim-eid",
    label: "Máy độ E-Sim EID",
    short: "Độ E-Sim EID",
    desc: "Dùng e-sim, không lắp sim vật lý vào khay.",
    icon: "wifi",
    symptoms: [
      {
        id: "khong-co-sim",
        label: "Không có sim",
        aliases: ["Không có sim", "No SIM"],
        hint: "Vào Cài đặt → Di động không thấy e-sim nào, hoặc danh sách trống.",
        steps: [
          {
            text: "Vào Cài đặt → Di động → Kiểm tra xem có sim nào đang tắt thì bật lên",
            note: "Nhiều máy không tự hiện sim từ đầu. Có thể bật/tắt chế độ máy bay để máy nhận sim.",
          },
          {
            text: "Nếu không thấy sim nào, tắt nguồn mở lại 3–4 lần rồi vào Cài đặt → Di động kiểm tra lại",
          },
          {
            text: "Vẫn không có sim: tìm một mã QR e-sim cũ bất kỳ, mở camera quét mã đó",
            note: "Máy sẽ báo lỗi khi quét — đây là điều bình thường. Sau đó vào lại Cài đặt → Di động để kiểm tra.",
          },
          RESET_NETWORK,
          {
            text: "Nếu vẫn không được → lỗi chip độ sim, cần thay chip độ sim mới",
            warning: true,
          },
        ],
      },
      {
        id: "khong-dich-vu",
        label: "Không dịch vụ",
        aliases: ["Không dịch vụ", "No Service", "Đang tìm kiếm"],
        hint: "Máy đã nhận e-sim nhưng không có vạch sóng.",
        steps: [
          {
            text: "Vào Cài đặt → Di động → Ứng dụng của sim → Bấm Restart/Refresh 1 lần",
            note: "Đây cũng là cách fix lỗi không có thông báo và lỗi không xoay ngang màn hình.",
          },
          RESTART_DEVICE,
          AIRPLANE_MODE,
          RESET_NETWORK,
          SELECT_CARRIER,
          {
            text: "Nếu vẫn không được → lỗi chip độ sim, cần thay chip độ sim mới",
            warning: true,
          },
        ],
      },
    ],
  },
];

/** Tra nhanh một nhánh theo id — dùng cho trình chẩn đoán. */
export function findDevice(id: string) {
  return deviceTypes.find((d) => d.id === id);
}
