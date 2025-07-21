import { useCallback, useEffect, useState } from "react";
import "./DocumentCount.css";
import { useAppDispatch } from "../../stores/store";
import { DocumentCountNumber } from "../../model/docmentCount.type";
import CircleLoading from "../../shared/circleLoading";
import { getAllDocumentCounts } from "../../stores/slices/documentCountSlice";

const DocumentCountPage = () => {
  const dispath = useAppDispatch();
  const [isCountLoading, setIsCountLoading] = useState<boolean>(false);

  const [documentCountData, setDocumentCountData] =
    useState<DocumentCountNumber>();

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

  return (
    <div className="container-DocumentCountPage">
      <div className="header-DocumentCountPage">
        <h1>เลขที่เอกสาร</h1>
      </div>

      <div className="wrap-container-DocumentCountPage">
        <div className="bookingCount-content">
          <h2>เลขที่เอกสารการจอง</h2>
          <p>{documentCountData?.bookingCount}</p>
        </div>

        <div className="bookingCount-content">
          <h2>เลขที่เอกสารการเบิกเงิน</h2>
          <p>{documentCountData?.expenseCount}</p>
        </div>
      </div>
      <CircleLoading open={isCountLoading} />
    </div>
  );
};

export default DocumentCountPage;
