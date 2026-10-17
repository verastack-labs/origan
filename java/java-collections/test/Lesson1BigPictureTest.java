import java.util.List;
import java.util.Map;

public class Lesson1BigPictureTest {
    static void testListDemo() {
        Check.eq("[Asha, Ravi, Asha]\nRavi\n3\n", Check.printed(Lesson1BigPicture::listDemo));
    }

    static void testSetDemo() {
        Check.eq("false\n2\ntrue\n", Check.printed(Lesson1BigPicture::setDemo));
    }

    static void testQueueDemo() {
        Check.eq("Asha\nRavi\n2\n", Check.printed(Lesson1BigPicture::queueDemo));
    }

    static void testMapDemo() {
        Check.eq("90\nnull\n0\n2\n", Check.printed(Lesson1BigPicture::mapDemo));
    }

    static void testCountLongDemo() {
        Check.eq("2\n1\n", Check.printed(Lesson1BigPicture::countLongDemo));
    }

    static void testEitherListDemo() {
        Check.eq("2 tea\n2 tea\n", Check.printed(Lesson1BigPicture::eitherListDemo));
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson1BigPicture.Starters.countDistinct(List.of()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson1BigPicture.Starters.wordCounts(List.of()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson1BigPicture.Starters.firstRepeat(List.of()));
    }

    static void testCountDistinct() {
        Check.eq(3, Lesson1BigPicture.Solutions.countDistinct(List.of("a", "b", "a", "c", "b")));
        Check.eq(0, Lesson1BigPicture.Solutions.countDistinct(List.of()));
    }

    static void testWordCounts() {
        Check.eq(
                Map.of("tea", 2, "coffee", 1),
                Lesson1BigPicture.Solutions.wordCounts(List.of("tea", "coffee", "tea")));
        Check.eq(Map.of(), Lesson1BigPicture.Solutions.wordCounts(List.of()));
    }

    static void testFirstRepeat() {
        Check.eq("b", Lesson1BigPicture.Solutions.firstRepeat(List.of("a", "b", "c", "b", "a")));
        Check.eq(null, Lesson1BigPicture.Solutions.firstRepeat(List.of("a", "b", "c")));
        Check.eq(null, Lesson1BigPicture.Solutions.firstRepeat(List.of()));
    }
}
