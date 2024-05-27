const [currentPage, setCurrentPage] = useState<number>(1);

const selectedItems = useAppSelector(itemsSelector);
const perPage = 3;

const startIndex = (currentPage - 1) * perPage;
const endIndex = startIndex + perPage;
const currentData = selectedItems?.slice(startIndex, endIndex);
console.log({ currentData });

const location = useLocation();
const query = new URLSearchParams(location.search);
const initialPage = parseInt(query.get("page") || "1", 10);

const handlePageChange = (page: number) => {
  setCurrentPage(page);
};


useEffect(() => {
  setCurrentPage(initialPage);
}, [initialPage]);