import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Lesson6HashSetAndHashMapTest {
    static void testSetBasics() {
        Check.eq("true\ntrue\nfalse\ntrue\n2\n", Check.printed(Lesson6HashSetAndHashMap::setDemo));
    }

    static void testMapBasics() {
        Check.eq(
                "98450 22222\nnull\ntrue\n98450 11111\n2\n",
                Check.printed(Lesson6HashSetAndHashMap::mapDemo));
    }

    static void testCounting() {
        Check.eq("3\n2\n1\n", Check.printed(Lesson6HashSetAndHashMap::countByHandDemo));
        Check.eq("3\n2\n1\n", Check.printed(Lesson6HashSetAndHashMap::mergeDemo));
    }

    static void testComputeIfAbsent() {
        Check.eq(
                "[Asha, Anil]\n[Ravi, Ravindra]\n[Meera]\n",
                Check.printed(Lesson6HashSetAndHashMap::computeIfAbsentDemo));
    }

    static void testWalk() {
        Check.eq("20\npads = 5\npens = 12\ntape = 3\n", Check.printed(Lesson6HashSetAndHashMap::walkDemo));
    }

    static void testTinyDemo() {
        // String.hashCode is defined by a formula in the Java docs, so these numbers are stable.
        Check.eq(
                "2050251 -> bucket 3\n2539842 -> bucket 2\n98450 33333\n2\n",
                Check.printed(Lesson6HashSetAndHashMap::tinyDemo));
    }

    static void testTinyHashMapGrows() {
        Lesson6HashSetAndHashMap.TinyHashMap<Integer, String> map = new Lesson6HashSetAndHashMap.TinyHashMap<>();
        Check.eq(8, map.bucketCount());
        for (int i = 0; i < 100; i++) {
            map.put(i, "v" + i);
        }
        Check.eq(100, map.size());
        Check.isTrue(map.bucketCount() > 8, "the table should have grown");
        for (int i = 0; i < 100; i++) {
            Check.eq("v" + i, map.get(i));
        }
        Check.eq(null, map.get(500));
        map.put(7, "seven");
        Check.eq("seven", map.get(7));
        Check.eq(100, map.size());
    }

    static void testTinyHashMapNegativeHash() {
        // "Vikram".hashCode() is negative; floorMod must still give a valid bucket.
        Lesson6HashSetAndHashMap.TinyHashMap<String, Integer> map = new Lesson6HashSetAndHashMap.TinyHashMap<>();
        map.put("Vikram", 1);
        Check.eq(1, map.get("Vikram"));
        int bucket = Lesson6HashSetAndHashMap.TinyHashMap.bucketFor("Vikram", 8);
        Check.isTrue(bucket >= 0 && bucket < 8, "bucket out of range");
    }

    static void testStartersAreStubs() {
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson6HashSetAndHashMap.Starters.firstDuplicate(List.of()));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson6HashSetAndHashMap.Starters.twoSum(new int[0], 1));
        Check.throwsA(UnsupportedOperationException.class, () -> Lesson6HashSetAndHashMap.Starters.groupByLength(List.of()));
    }

    static void testFirstDuplicate() {
        Check.eq("tea", Lesson6HashSetAndHashMap.Solutions.firstDuplicate(List.of("tea", "chai", "tea", "chai")));
        Check.eq("chai", Lesson6HashSetAndHashMap.Solutions.firstDuplicate(List.of("tea", "chai", "chai", "tea")));
        Check.eq(null, Lesson6HashSetAndHashMap.Solutions.firstDuplicate(List.of("tea", "chai")));
        Check.eq(null, Lesson6HashSetAndHashMap.Solutions.firstDuplicate(List.of()));
    }

    static void testTwoSum() {
        Check.eq(new int[] {0, 1}, Lesson6HashSetAndHashMap.Solutions.twoSum(new int[] {2, 7, 11, 15}, 9));
        Check.eq(new int[] {1, 2}, Lesson6HashSetAndHashMap.Solutions.twoSum(new int[] {3, 2, 4}, 6));
        // 3 + 3 uses two different positions, but one 3 alone cannot be used twice.
        Check.eq(new int[] {0, 1}, Lesson6HashSetAndHashMap.Solutions.twoSum(new int[] {3, 3}, 6));
        Check.eq(new int[0], Lesson6HashSetAndHashMap.Solutions.twoSum(new int[] {3, 5}, 6));
        Check.eq(new int[0], Lesson6HashSetAndHashMap.Solutions.twoSum(new int[0], 0));
    }

    static void testGroupByLength() {
        Map<Integer, List<String>> groups =
                Lesson6HashSetAndHashMap.Solutions.groupByLength(List.of("pen", "cup", "bottle", "ink", "plate"));
        Check.eq(List.of("pen", "cup", "ink"), groups.get(3));
        Check.eq(List.of("bottle"), groups.get(6));
        Check.eq(List.of("plate"), groups.get(5));
        Check.eq(3, groups.size());
        Check.eq(Map.of(), Lesson6HashSetAndHashMap.Solutions.groupByLength(new ArrayList<>()));
    }
}
