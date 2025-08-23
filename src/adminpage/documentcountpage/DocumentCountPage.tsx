import { useCallback, useEffect, useState } from "react";
import "./DocumentCount.css";
import { useAppDispatch } from "../../stores/store";
import { DocumentCountNumber } from "../../model/docmentCount.type";
import CircleLoading from "../../shared/circleLoading";
import { getAllDocumentCounts } from "../../stores/slices/documentCountSlice";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

const initDocumentCountNumberForm: DocumentCountNumber = {
  expenseCount: 0,
  bookingCount: 0,
};

const DocumentCountPage = () => {
  const dispath = useAppDispatch();
  const navigate = useNavigate();
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);

  const [documentCountData, setDocumentCountData] = useState<DocumentCountNumber>();

  const { control, handleSubmit } = useForm({
    defaultValues: initDocumentCountNumberForm,
  });

  const fetchAllDocumentCount = useCallback(async () => {
    try {
      setIsCountLoading(true);

      const { data = [] } = await dispath(getAllDocumentCounts()).unwrap();
      if (data.length > 0) {
        setDocumentCountData(data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCountLoading(false);
    }
  }, [dispath]);

  useEffect(() => {
    fetchAllDocumentCount();
  }, [fetchAllDocumentCount]);

  const onSubmit = async (value: DocumentCountNumber) => {
    const item = {
      ...value,
    };

    console.log(item);
  };

  return (
    <div className="container-DocumentCountPage">
      <div className="header-DocumentCountPage">
        <h1>เลขที่เอกสาร</h1>
      </div>

      <div className="navbar-DocumentCountPage">
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => {
              navigate("/admin/setting");
            }}
          >
            ย้อนกลับ
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="wrap-container-DocumentCountPage">
        <div className="bookingCount-content">
          <div className="header-bookingCount">
            <h2>เลขที่เอกสารการจอง</h2>
            <h2>BKC {documentCountData?.bookingCount}</h2>
          </div>

          <div className="content-bookingCount">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>แก้ไขเลขที่</p>

              <Controller
                control={control}
                name="bookingCount"
                render={({ field }) => {
                  return (
                    <input
                      {...field}
                      type="text"
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9.]/g, "");
                        const validated = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
                        if (validated) {
                          field.onChange(Number(value));
                        }
                      }}
                    />
                  );
                }}
              />
            </div>

            <div style={{ paddingTop: "100px" }}>
              <button className="btn-submit" type="submit">
                บันทึก
              </button>
            </div>
          </div>
        </div>

        <div className="bookingCount-content">
          <div className="header-bookingCount">
            <h2>เลขที่เอกสารการเบิกเงิน</h2>
            <h2>EXC {documentCountData?.expenseCount}</h2>
          </div>

          <div className="content-bookingCount">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p>แก้ไขเลขที่</p>

              <Controller
                control={control}
                name="expenseCount"
                render={({ field }) => {
                  return (
                    <input
                      {...field}
                      type="text"
                      onChange={(event) => {
                        const value = event.target.value.replace(/[^0-9.]/g, "");
                        const validated = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
                        if (validated) {
                          field.onChange(Number(value));
                        }
                      }}
                    />
                  );
                }}
              />
            </div>

            <div style={{ paddingTop: "100px" }}>
              <button className="btn-submit" type="submit">
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </form>

      <CircleLoading open={isCountLoading} />
    </div>
  );
};

export default DocumentCountPage;
